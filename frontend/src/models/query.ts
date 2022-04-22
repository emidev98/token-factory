import { Address } from "./address"

export interface MintedTokensResponse {
    minted_tokens: Array<Address>
}

export interface BalanceResponse {
    balance: String
}

export interface TokenInfoResponse {
    name: String,
    symbol: String,
    decimals: Number,
    total_supply: Number
}