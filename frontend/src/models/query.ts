import { Address } from "./address"

export interface MintedTokensResponse {
    minted_tokens: Array<Address>
}

export interface BalanceResponse {
    balance: string
}

export interface TokenInfoResponse {
    name: string,
    symbol: string,
    decimals: number,
    total_supply: number
}

export interface MarketingResponse {
    description?: string,
    logo?: { url?: string},
    project?: string,
}

export interface TokenData {
    name?: string,
    symbol?: string,
    decimals?: number,
    total_supply?: number,
    description?: string,
    logo?: { url?: string},
    project?: string,
}
