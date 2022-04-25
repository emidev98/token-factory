import * as query from '../contract/query';
import { useEffect, useState } from 'react'
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { TokenData } from '../models/query';
import Loader from './../components/Loader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function Tokens() {
  const [tokenInfo, setTokenInfo] = useState(new Array<TokenData>())
  const [loading, setLoading] = useState(true)

  const connectedWallet = useConnectedWallet() as ConnectedWallet
  const { status } = useWallet()

  useEffect(() => {
    const preFetch = async () => {
      if (status === WalletStatus.WALLET_CONNECTED) {
        const tokensAddresses = await query.getMintedTokens(connectedWallet);

        const tokenInfoPromises = tokensAddresses.minted_tokens.map(tokenAddress => {
          return query.getTokenInfo(tokenAddress, connectedWallet);
        });

        const tokenInfo = await Promise.all(tokenInfoPromises);

        setTokenInfo(tokenInfo);
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Fat&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokenInfo.map((token) => (
                <TableRow key={token.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <img src={token.logo?.url} style={{maxWidth: "48px",maxHeight: "48px"}}/>
                  </TableCell>
                  <TableCell>{token.name}</TableCell>
                  <TableCell>{token.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>)
      }
    </div>
  )
}
export default Tokens
