use std::vec;

use crate::error::ContractError;
use crate::msg::{DepositType, ExecuteMsg, InstantiateMsg, MigrateMsg, MintedTokens, QueryMsg};
use crate::state::{Config, CONFIG, MINTED_TOKENS};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    coins, to_binary, BankMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Reply,
    Response, StdError, StdResult, SubMsg, Uint128, WasmMsg,
};
use cw2::set_contract_version;

/* Define contract name and version */
const CONTRACT_NAME: &str = "crates.io:token-factory";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const INSTANTIATE_REPLY_ID: u64 = 1;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    /* Define the initial configuration for this contract that way you can
    limit the type of coin you want to accept each time a token-factory is
    created and also which kind of token would you like to mint based on
    the code id of the contract deployed */
    let state = Config {
        stable_denom: msg.stable_denom.to_string(),
        token_contract_code_id: msg.token_contract_code_id,
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    CONFIG.save(deps.storage, &state)?;
    MINTED_TOKENS.save(deps.storage, &Vec::new())?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute(
            "token_contract_code_id",
            msg.token_contract_code_id.to_string(),
        ))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        /* Method executed each time someone send funds to the contract to mint 
        a new token or to increase already existent tokens circulating supply */
        ExecuteMsg::Deposit(deposit_type) => match_deposit(deps.as_ref(), env, info, deposit_type),
        /* Method used to burn an existent token created thru this contract
        and send the UST back to the address that burn these tokens.*/
        ExecuteMsg::Burn {
            amount,
            token_address,
        } => execute_burn_from(deps, info, amount, token_address),
    }
}

pub fn match_deposit(
    deps: Deps,
    env: Env,
    info: MessageInfo,
    deposit_type: DepositType,
) -> Result<Response, ContractError> {
    match deposit_type {
        /* When the InstantiateMsg struct is send the factory will 
        execute this code and a new token with the defined properties
        will be minted */
        DepositType::Instantiate(token_data) => {
            execute_instantiate_token(deps, env, info, token_data)
        }
        /* If a token_address and recipient is received along with a
        deposit this method will increase the supply of an already 
        existent token by the defined units of UST received */
        DepositType::Mint {
            token_address,
            recipient,
        } => execute_mint(deps, info, token_address, recipient),
    }
}

pub fn execute_instantiate_token(
    deps: Deps,
    env: Env,
    info: MessageInfo,
    mut token_data: cw20_base::msg::InstantiateMsg,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let received_funds = get_received_funds(&deps, &info)?;
    let mut expected_amount = Uint128::zero();

    /* Add all initial token supply */
    token_data
        .initial_balances
        .iter()
        .for_each(|t| expected_amount += t.amount);

    /* Check if received_funds is different than
    initial token supply and throw an error */
    if expected_amount.ne(&received_funds.amount) {
        return Err(ContractError::ReceivedFundsMismatchWithMintAmount {
            received_amount: received_funds.amount,
            expected_amount,
        });
    }

    /* If a minter exists replace the minter address with
    the token-factory address that way the minting is only
    allowed thru this smart contract. */
    token_data.mint = match token_data.mint {
        None => None,
        Some(mut e) => {
            e.minter = env.contract.address.to_string();
            Some(e)
        }
    };

    /* Create a WasmMsg to mint new CW20-base token.
    https://github.com/CosmWasm/cw-plus/tree/0.9.x/contracts/cw20-base */
    let instantiate_message = WasmMsg::Instantiate {
        admin: Some(env.contract.address.to_string()),
        code_id: config.token_contract_code_id,
        msg: to_binary(&token_data)?,
        funds: vec![],
        label: token_data.name,
    };

    /* Define the SubMessage on CosmWasm API to allow a callback on reply
    entry point. This call will be executed with INSTANTIATE_REPLY_ID if
    the call succeed after being executed by the method add_submessage(response)
    from Response implementation.
    More Info: https://docs.cosmwasm.com/docs/1.0/smart-contracts/message/submessage */
    let sub_msg = SubMsg::reply_on_success(instantiate_message, INSTANTIATE_REPLY_ID);

    /* Respond with the method name and SubMsg. 
    SubMsg will be executed to callback on reply 
    method with INSTANTIATE_REPLY_ID as identifier 
    to complete further operations */
    Ok(Response::new()
        .add_attribute("method", "instantiate_token")
        .add_submessage(sub_msg))
}

pub fn get_received_funds(deps: &Deps, info: &MessageInfo) -> Result<Coin, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    match info.funds.get(0) {
        None => return Err(ContractError::NotReceivedFunds {}),
        Some(received) => {
            /* Amount of tokens received cannot be zero */
            if received.amount.is_zero() {
                return Err(ContractError::NotAllowZeroAmount {});
            }

            /* Allow to receive only token denomination defined
            on contract instantiation "config.stable_denom" */
            if received.denom.ne(&config.stable_denom) {
                return Err(ContractError::NotAllowedDenom {
                    denom: received.denom.to_string(),
                });
            }

            /* Only one token can be received */
            if info.funds.len() > 1 {
                return Err(ContractError::NotAllowedMultipleDenoms {});
            }
            Ok(received.clone())
        }
    }
}

pub fn execute_mint(
    deps: Deps,
    info: MessageInfo,
    token_address: String,
    recipient: String,
) -> Result<Response, ContractError> {
    let received_funds = get_received_funds(&deps, &info)?;
    let token_addr_from_list = MINTED_TOKENS
        .load(deps.storage)
        .unwrap()
        .into_iter()
        .find(|t| t == &token_address);

    /* Check if the token to be minted exists in the list, otherwise
    throw an error because minting must not be allowed for a token
    that was not created with this factory */
    if token_addr_from_list == None {
        return Err(ContractError::TokenAddressMustBeWhitelisted {});
    }

    /* Create an execute message to mint new units of an existent token */
    let execute_mint = WasmMsg::Execute {
        contract_addr: token_address.clone(),
        msg: to_binary(&cw20_base::msg::ExecuteMsg::Mint {
            amount: received_funds.amount,
            recipient: recipient.clone(),
        })?,
        funds: vec![],
    };

    /* This type of SubMessage will never reply as no further operation is needed, 
    but for sure the mint call to instantiated cw20_base contract needs to be done.
    More Info: https://docs.cosmwasm.com/docs/1.0/smart-contracts/message/submessage */
    let mint_sub_msg = SubMsg::new(execute_mint);

    Ok(Response::new()
        .add_attribute("method", "mint")
        .add_submessage(mint_sub_msg))
}

pub fn execute_burn_from(
    deps: DepsMut,
    info: MessageInfo,
    amount: Uint128,
    token_address: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let token_addr_from_list = MINTED_TOKENS
        .load(deps.storage)
        .unwrap()
        .into_iter()
        .find(|t| t == &token_address);

    /* Check if the token to be burned exists in the list, otherwise
    throw an error because minting must not be allowed for a token
    that was not created thru the factory */
    if token_addr_from_list == None {
        return Err(ContractError::TokenAddressMustBeWhitelisted {});
    }

    /* Amount of tokens to be burned must not be zero */
    if amount.is_zero() {
        return Err(ContractError::NotAllowZeroAmount {});
    }

    /* Create a SubMessage to decrease the circulating supply of existent 
    CW20 Tokens from the token_address.
    https://github.com/CosmWasm/cosmwasm/blob/main/SEMANTICS.md#submessages */
    let sub_msg_burn = SubMsg::new(WasmMsg::Execute {
        contract_addr: token_address.clone(),
        msg: to_binary(&cw20_base::msg::ExecuteMsg::BurnFrom {
            owner: info.sender.to_string(),
            amount,
        })?,
        funds: vec![],
    });

    /* Create a SubMessage to transfer fund from this smart contract to
    the address that burns the CW20 Tokens*/
    let sub_msg_send = SubMsg::new(CosmosMsg::Bank(BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: coins(amount.u128(), config.stable_denom),
    }));

    Ok(Response::new()
        .add_attribute("method", "burn")
        .add_submessages(vec![sub_msg_burn, sub_msg_send]))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> StdResult<Response> {
    match msg.id {
        INSTANTIATE_REPLY_ID => handle_instantiate_reply(deps, msg),
        id => Err(StdError::generic_err(format!("Unknown reply id: {}", id))),
    }
}

fn handle_instantiate_reply(deps: DepsMut, msg: Reply) -> StdResult<Response> {
    let result = msg.result.into_result().map_err(StdError::generic_err)?;

    /* Find the event type instantiate_contract which contains the contract_address*/
    let event = result
        .events
        .iter()
        .find(|event| event.ty == "instantiate_contract")
        .ok_or_else(|| StdError::generic_err("cannot find `instantiate_contract` event"))?;

    /* Find the contract_address from instantiate_contract event*/
    let contract_address = &event
        .attributes
        .iter()
        .find(|attr| attr.key == "contract_address")
        .ok_or_else(|| StdError::generic_err("cannot find `contract_address` attribute"))?
        .value;

    /* Update the state of the contract adding the new generated MINTED_TOKEN */
    MINTED_TOKENS.update(deps.storage, |mut tokens| -> StdResult<Vec<String>> {
        tokens.push(contract_address.to_string());
        Ok(tokens)
    })?;

    Ok(Response::new()
        .add_attribute("method", "handle_instantiate_reply")
        .add_attribute("contract_address", contract_address))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        /* Return the list of all tokens that were minted thru this contract */
        QueryMsg::GetMintedTokens {} => to_binary(&query_minted_tokens(deps)?),
    }
}

fn query_minted_tokens(deps: Deps) -> StdResult<MintedTokens> {
    Ok(MintedTokens {
        minted_tokens: MINTED_TOKENS.load(deps.storage)?,
    })
}

/* In case you want to upgrade this contract you can find information about
how to migrate the contract in the following link:
https://docs.terra.money/docs/develop/dapp/quick-start/contract-migration.html*/
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> StdResult<Response> {
    Ok(Response::default())
}
