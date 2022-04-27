import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { TokenData } from "../../models/query";
import "./TokenDashboard.scss";

type Props = {
    token: TokenData
}

function TokenDashboard(props: Props) {
    const { token } = props;

    return (
        <Grid className="TokenDashboard"
            container
            alignItems="center"
            spacing={3}>
            <Grid item xs={4}>
                <Card className="TokenCard">
                    <CardContent className="TokenCardContent">
                        {token.logo?.url && <img src={token.logo?.url} alt="logo" />}
                        {!token.logo?.url && <span>Logo not available</span>}
                    </CardContent>
                </Card>
            </Grid>


            <Grid item xs={4}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Name" />
                    <CardContent className="TokenCardContent">{token.name}</CardContent>
                </Card>
            </Grid>

            <Grid item xs={4}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Symbol" />
                    <CardContent className="TokenCardContent">{token.symbol}</CardContent>
                </Card>
            </Grid>

            <Grid item xs={4}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Project name" />
                    <CardContent className="TokenCardContent">{token.project} </CardContent>
                </Card>
            </Grid>

            <Grid item xs={8}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Project description" />
                    <CardContent className="TokenCardContent">{token.description} </CardContent>
                </Card>
            </Grid>

            <Grid item xs={3}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Total Supply" />
                    <CardContent className="TokenCardContent">
                        {token.total_supply &&
                            <span>{Number(token.total_supply) / 10 ** Number(token.decimals)}</span>
                        }
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={3}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Cap" />
                    <CardContent className="TokenCardContent">
                        {token.cap &&
                            <span>{Number(token.cap) / 10 ** Number(token.decimals)}</span>
                        }
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={3}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Minted" />
                    <CardContent className="TokenCardContent">
                        {token.total_supply &&
                            <span>{(Number(token.total_supply) / Number(token.cap) * 100).toFixed(2)}%</span>
                        }
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={3}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Decimals" />
                    <CardContent className="TokenCardContent">{token.decimals}</CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}></Grid>
        </Grid>
    );
}

export default TokenDashboard;