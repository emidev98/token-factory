import { LCDClient } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-provider'
import { factoryAddress } from './address'
import { MarketingResponse, MintedTokensResponse, TokenData, TokenInfoResponse } from '../models/query';
import { Address } from '../models/address';

export const getMintedTokens = async (wallet: ConnectedWallet): Promise<MintedTokensResponse> => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(factoryAddress(wallet), { get_minted_tokens: {} })
}

export const getTokenInfo = async (tokenAddress: Address, wallet: ConnectedWallet): Promise<TokenData> => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  });
  let tokenData: TokenData = {};

  try {
    let queryTokenInfo: TokenInfoResponse = await lcd.wasm.contractQuery(tokenAddress, {
      token_info: {}
    });
    tokenData = {
      ...queryTokenInfo
    }
  }
  catch(e) {
    console.error(e);
  }
  try {
    let marketingInfo: MarketingResponse = await lcd.wasm.contractQuery(tokenAddress, {
      marketing_info: {}
    });
    tokenData = {
      ...tokenData,
      ...marketingInfo
    }
  } catch(e) {
    console.error(e);
  }

  return tokenData;
}