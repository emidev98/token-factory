use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    /* Denomination of the stable asset
    https://docs.terra.money/docs/develop/module-specifications/spec-market.html#market */
    pub stable_denom: String,

    /* Id of the contract uploaded to the chain used to instantiate
    the different tokens
    https://docs.terra.money/docs/develop/module-specifications/spec-wasm.html#code-id */
    pub token_contract_code_id: u64,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const MINTED_TOKENS: Item<Vec<String>> = Item::new("minted_tokens");