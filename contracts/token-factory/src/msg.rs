use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    /* Denomination of the stable asset
    https://docs.terra.money/docs/develop/module-specifications/spec-market.html#market */
    pub stable_denom: String,

    /* Id of the contract uploaded for the first time to the chain
    https://docs.terra.money/docs/develop/module-specifications/spec-wasm.html#code-id */
    pub token_contract_code_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    /* Handle the deposits of native tokens into the smart contract to mint
    the new pegged token 1:1 with LUNA or to increase circulation supply. */
    Deposit(DepositType),

    /* Handle burn of pegged tokens 1:1 with LUNA which are added to
    MINTED_TOKENS list and return the LUNA stored into the contract. */
    Burn {
        amount: Uint128,
        token_address: String
    }
}


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum DepositType {
    /* Instantiate a CW20_base token */
    Instantiate(cw20_base::msg::InstantiateMsg),
    /* Create new tokens based on token_address, amount of LUNA send to 
    this contract and recipient address */
    Mint {
        token_address: String,
        recipient: String,
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /* Returns the list of token addresses that were created with this contract */
    GetMintedTokens { },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct MintedTokens {
    pub minted_tokens: Vec<String>
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MigrateMsg {}
