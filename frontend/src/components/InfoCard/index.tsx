import { Card, CardContent } from "@mui/material";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import "./InfoCard.scss";

function InfoCard() {
    const { status } = useWallet();

    return (
        <Card className="InfoCard">
            <CardContent>
                <h2>CW20 Token Factory</h2>
                <div className="InfoCardDivider"/>
                <div>
                    <b>Create</b> a new token.<br/><br/>
                    <b>Mint</b> already existent tokens.<br/><br/>
                    <b>Burn</b> tokens. <br/><br/>
                    Everything pegged 1:1 on UST
                </div>
                <h3 style={{
                    opacity: status === WalletStatus.WALLET_NOT_CONNECTED ? "1" : "0"
                }}>
                    First... Remember to connect the wallet
                </h3>
            </CardContent>
        </Card>
    );
}
export default InfoCard;