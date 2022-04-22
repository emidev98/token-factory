import { AccAddress } from "@terra-money/terra.js"

export interface Token {
    name: String,
    symbol: String,
    decimals: Number,
    initial_balances: Array<InitialBalances>,
    mint?: Mint,
    marketing?: MarketingInfo;
}

export interface InitialBalances {
    amount: String,
    address: AccAddress
}

export interface Mint {
    minter: AccAddress,
    cap: String
}

export interface MarketingInfo {
    project?: String,
    description?: String,
    marketing?: String,
    logo?: MarketingLogo,
}

export interface MarketingLogo {
    url: String,
    embedded: String
}

export class TokenUtils {
    static fromTokenData = (tokenData : TokenData) : Token => {
        const clonedTokenData = Object.assign({}, tokenData);
        
        return {
            name: clonedTokenData.name,
            symbol: clonedTokenData.symbol,
            decimals: clonedTokenData.decimals,
            initial_balances: clonedTokenData.initial_balances,
            mint: {
                minter: tokenData.minter,
                cap: tokenData.cap.toString()
            }
        };
    }
}

export interface TokenData {
    name: string;
    symbol: string;
    decimals: number;
    amount: string;
    initial_balances: Array<InitialBalances>;
    minter: string;
    cap: number;
}