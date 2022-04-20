use cosmwasm_std::{StdError, Uint128};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("NotReceivedFunds")]
    NotReceivedFunds {},

    #[error("NotAllowZeroAmount")]
    NotAllowZeroAmount {},

    #[error("NotAllowedDenom")]
    NotAllowedDenom { 
        denom: String
    },

    #[error("NotAllowedMultipleDenoms")]
    NotAllowedMultipleDenoms {},

    #[error("TokenAddressMustBeWhitelisted")]
    TokenAddressMustBeWhitelisted {},

    #[error("ReceivedFundsMismatchWithMintAmount")]
    ReceivedFundsMismatchWithMintAmount {
        received_amount: Uint128,
        expected_amount: Uint128
    },
}
