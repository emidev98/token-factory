import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Address } from "../../models/address";
import Loader from "../Loader";
import "./TokenDialog.scss";

export type TokenPropsType = null | "MINT" | "BURN";
export type CloseType = "SUBMIT" | "CLOSE";

export interface SubmitTokenData {
    amount?: number,
    address?: Address,
};

type TokenProps = {
    type: TokenPropsType,
    symbol: string | undefined,
    walletAddress?: string,
    holdingAmount?: number,
    onSubmitData: (closeType : CloseType, data: SubmitTokenData) => void
};

function TokenDialog(props: TokenProps) {
    const { type, symbol, walletAddress, holdingAmount } = props;
    const [state, setState] = useState({
        amount: 1,
        address: "",
    } as SubmitTokenData);
    const [loading, setLoading] = useState(false);

    const onSubmitData = async (type : CloseType) => {
        setLoading(true);
        await props.onSubmitData(type, state);
        setState({
            amount: 1,
            address: ""
        });
        setLoading(false);
    }

    const onValueChange = (e: any) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        });
    }

    const onUseConnectedWallet = () => {
        setState({
            ...state,
            address: walletAddress
        })
    }

    const onUseAllHoldings = () => {
        setState({
            ...state,
            amount: holdingAmount
        })
    }
    return (
        <Dialog className="TokenDialog"
            open={type !== null}
            onClose={()=>onSubmitData("CLOSE")}>
            <DialogTitle>
                {type === "MINT" && `Mint ${symbol} tokens`}
                {type === "BURN" && `Burn ${symbol} tokens`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {type === "MINT" && `Per each unit of ${symbol} token you mint you will have to deposit 1 UST. Minted tokens will be send to the address below`}
                    {type === "BURN" && `Per each unit of ${symbol} token you burn you will receive 1 UST back to your wallet.`}
                </DialogContentText>
                <Grid container
                    spacing={2}>
                    <Grid item xs={12}></Grid>
                    <Grid item
                        xs={8}>
                        <TextField
                            id="address"
                            placeholder="terra..."
                            label="Address"
                            value={state.address}
                            onChange={onValueChange}
                            variant="standard"
                            fullWidth />
                    </Grid>
                    <Grid className="ButtonWrapper" 
                        item 
                        xs={4}>
                        <Button variant="contained" 
                            onClick={onUseConnectedWallet}>Connected address</Button>
                    </Grid>

                    <Grid item
                        xs={(type === "BURN" ? 8 : 12)}>
                        <TextField
                            id="amount"
                            value={state.amount}
                            onChange={onValueChange}
                            placeholder="1"
                            label="Amount"
                            variant="standard"
                            fullWidth />
                    </Grid>
                    {type === "BURN" &&
                        <Grid className="ButtonWrapper" 
                            item 
                            xs={4}>
                            <Button variant="contained" 
                                onClick={onUseAllHoldings}>All tokens</Button>
                        </Grid>
                    }
                </Grid>
            </DialogContent>
            <DialogActions className="TokenDialogActions">
                <Button variant="contained" 
                    onClick={()=>onSubmitData("CLOSE")}>Cancel</Button>
                <Button variant="contained" 
                    onClick={()=>onSubmitData("SUBMIT")}>
                        {type === "BURN" && "Burn token"}
                        {type === "MINT" && "Mint token"}
                    </Button>
            </DialogActions>
            {loading && <Loader/>}
        </Dialog>
    );
}
export default TokenDialog;