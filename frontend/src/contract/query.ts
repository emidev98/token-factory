import { LCDClient } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-provider'
import { factoryAddress } from './address'
import { BalanceResponse, MintedTokensResponse, TokenInfoResponse } from '../models/query';
import { Address } from '../models/address';

export const getMintedTokens = async (wallet: ConnectedWallet) : Promise<MintedTokensResponse> => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(factoryAddress(wallet), { get_minted_tokens: {} })
}

export const getWalletBalances = async (tokenAddress: Address, wallet: ConnectedWallet) : Promise<BalanceResponse> => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(tokenAddress, {
    balance: {
      address: wallet.terraAddress
    }
  })
}

export const getAllAllowances = async (tokenAddress: Address, wallet: ConnectedWallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(tokenAddress, {
    all_allowances: { 
      owner: wallet.terraAddress
    }
  })
}

export const getTokenInfo = async (tokenAddress: Address, wallet: ConnectedWallet) : Promise<TokenInfoResponse> =>{
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(tokenAddress, {
    token_info: { }
  })
}

export const getAllAccounts = async (tokenAddress: Address, wallet: ConnectedWallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(tokenAddress, {
    all_accounts: { }
  })
}

