import * as query from '../contract/query';
import { useEffect, useState } from 'react'
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { Address } from '../models/address';
import { TokenInfoResponse } from '../models/query';
import * as execute from './../contract/execute';
import Loader from './../components/Loader';

function Tokens() {
  const [mintedTokensAddresses, setMintedTokensAddresses] = useState(new Array<Address>())
  const [balances, setBalances] = useState(new Array<String>())
  const [tokenInfo, setTokenInfo] = useState(new Array<TokenInfoResponse>())
  const [loading, setLoading] = useState(true)

  const connectedWallet = useConnectedWallet() as ConnectedWallet

  const { status } = useWallet()
  useEffect(() => {
    const preFetch = async () => {
      if (status === WalletStatus.WALLET_CONNECTED) {
        const tokensAddresses = await query.getMintedTokens(connectedWallet);

        const balancePromises = tokensAddresses.minted_tokens.map(tokenAddress => {
          return query.getWalletBalances(tokenAddress, connectedWallet);
        });

        const tokenInfoPromises = tokensAddresses.minted_tokens.map(tokenAddress => {
          return query.getTokenInfo(tokenAddress, connectedWallet);
        });

        const balances = (await Promise.all(balancePromises)).map(qry => qry.balance);
        const tokenInfo = await Promise.all(tokenInfoPromises);

        setMintedTokensAddresses(tokensAddresses.minted_tokens);
        setTokenInfo(tokenInfo);
        setBalances(balances);
        setLoading(false)
      }
      else {
        setLoading(true)
      }
    }
    preFetch()
  }, [status, connectedWallet])


  return (
    <div className="Tokens">
      {loading ? <Loader /> : (
        <>
          <div>
            {mintedTokensAddresses.map((tokenAddress, index) =>
              <div key={index}>
                <span>{tokenAddress}</span>
                <button onClick={() => execute.mintToken(tokenAddress, connectedWallet)}>Mint</button>
                <button onClick={() => execute.burnToken(tokenAddress, "100000", connectedWallet)}>Burn</button>
              </div>
            )}
          </div>
          <div>
            <div>
              {balances.map((balance, index) =>
                <div key={index}>
                  {balance}
                </div>
              )}
            </div>

            <div>
              <div>
                {tokenInfo.map((tokenInfo, index) =>
                  <div key={index}>
                    {JSON.stringify(tokenInfo)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>)
      }
    </div>
  )
}
export default Tokens
