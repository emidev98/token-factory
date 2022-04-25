import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import "./Loader.scss";

interface Props {
    position?: "fixed" | "absolute" | "relative";
}

function Loader(props: Props) {
    const position =  props.position ? props.position : "absolute";
    const { status } = useWallet()

    return (
        <div className="LoaderWrapper"  
            style={{position : position}}>
            <div className="Loader">
                <div className="LoaderAnimation">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                {status === WalletStatus.WALLET_NOT_CONNECTED 
                    ? <h2>Connect wallet to visualize this page</h2>
                    : <h2>Loading...</h2> 
                }
            </div>
        </div>
    );
}

export default Loader;