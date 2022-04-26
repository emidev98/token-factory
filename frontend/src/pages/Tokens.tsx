import * as query from '../contract/query';
import { useEffect, useState } from 'react'
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { TokenData } from '../models/query';
import Loader from './../components/Loader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

function Tokens() {
  const [tokens, setTokens] = useState(new Array<TokenData>())
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const connectedWallet = useConnectedWallet() as ConnectedWallet
  const { status } = useWallet()

  useEffect(() => {
    const preFetch = async () => {
      if (status === WalletStatus.WALLET_CONNECTED) {
        const tokensAddresses = await query.getMintedTokens(connectedWallet);

        const tokensPromises = tokensAddresses.minted_tokens.map(tokenAddress => {
          return query.getTokenInfo(tokenAddress, connectedWallet);
        });

        const tokens = await Promise.all(tokensPromises);
        console.log(tokens);
        setTokens(tokens);
        setLoading(false)
      }
      else {
        setLoading(true)
      }
    }
    preFetch()
  }, [status, connectedWallet])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="Tokens">
      {loading ? <Loader /> : (
        <TableContainer component={Paper}
        style={{ 
          display:"flex", 
          flexGrow: "1", 
          flexDirection: "column"
        }}>
          <Table style={{flexGrow: "1"}}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Supply</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((token, index) => (
                <TableRow key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <img src={token.logo?.url} style={{ maxWidth: "48px", maxHeight: "48px" }} />
                  </TableCell>
                  <TableCell>{token.name}</TableCell>
                  <TableCell>{token.symbol}</TableCell>
                  <TableCell>{token.total_supply}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tokens.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage} />
        </TableContainer>)
      }
    </div>
  )
}
export default Tokens
