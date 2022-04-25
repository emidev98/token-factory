import { useEffect, useState } from 'react'
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Loader from './../components/Loader';
import { useParams } from 'react-router-dom';

function Token() {
  const [loading, setLoading] = useState(true)
  let { id } = useParams();

  const connectedWallet = useConnectedWallet() as ConnectedWallet
  const { status } = useWallet()

  useEffect(() => {
    const preFetch = async () => {
      if (status === WalletStatus.WALLET_CONNECTED) {
        
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
          {id}
          </>
        )
      }
    </div>
  )
}
export default Token
