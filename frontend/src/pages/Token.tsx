import { useEffect, useState } from 'react'
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Loader from './../components/Loader';
import TokenDashboard from './../components/TokenDashboard';
import TokenHoldersList from './../components/TokenHoldersList';
import { useParams } from 'react-router-dom';
import { getTokenAccountsWithBalance, getTokenData } from '../contract/query';
import { Address } from '../models/address';
import { TokenData, TokenHolder } from '../models/query';

function Token() {
  const [loading, setLoading] = useState(true);
  const [loadingTokeHolders, setLoadingTokeHolders] = useState(true);
  const [tokenData, setTokenData] = useState({} as TokenData);
  const [tokenHolders, setTokenHolders] = useState({ holders: Array<TokenHolder>()});
  let { id } = useParams();

  const connectedWallet = useConnectedWallet() as ConnectedWallet
  const { status } = useWallet()

  useEffect(() => {
    const preFetch = async () => {
      if (status === WalletStatus.WALLET_CONNECTED) {
        const tokenData = await getTokenData(id as Address, connectedWallet);
        setLoading(false);
        setTokenData(tokenData);

        setLoadingTokeHolders(true);
        const holders = await getTokenAccountsWithBalance(id as Address, connectedWallet);
        setTokenHolders({holders});
        setLoadingTokeHolders(false);
      }
      else {
        setLoading(true)
      }
    }
    preFetch()
  }, [status, connectedWallet])


  return (
    <div className="Tokens">
      {loading && <Loader />}
      <TokenDashboard token={tokenData}/>
      <TokenHoldersList holders={tokenHolders.holders}
        symbol={tokenData.symbol as string}
        decimals={Number(tokenData.decimals)}
        totalSupply={Number(tokenData.total_supply)}
        pageLoading={loading}
        loading={loadingTokeHolders}/>
    </div>
  )
}
export default Token
