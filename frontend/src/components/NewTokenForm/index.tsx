import './NewTokenForm.scss';
import { useEffect, useState } from 'react'
import { Token, TokenData, TokenUtils } from './../../models/token';
import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { Add, PersonAdd, PlaylistRemove } from '@mui/icons-material';
import { factoryAddress } from '../../contract/address';
import { useConnectedWallet } from '@terra-money/wallet-provider';


type Props = {
    onCreateNewToken: (token: Token) => Promise<any>;
};

function NewTokenForm(props: Props) {
    const connectedWallet = useConnectedWallet();
    const [tokenData, setTokenData] = useState({
        initial_balances: Array(1).fill({
            address: "",
            amount: ""
        })
    } as TokenData);

    useEffect(()=> {
        if(connectedWallet) {
            setTokenData({
                ...tokenData,
                minter: factoryAddress(connectedWallet)
            })
        }
    },[connectedWallet])

    const submitCreateToken = async (event: any) => {
        event.preventDefault();
        const token = TokenUtils.fromTokenData(tokenData);
        await props.onCreateNewToken(token);
    }

    const onValueChange = (event: any) => {
        // @ts-ignore;
        setTokenData({
            ...tokenData,
            [event.target.id]: event.target.value
        });
    }

    const onIncreaseInitialBalance = (event: any) => {
        let initial_balances = tokenData.initial_balances;
        initial_balances.push({
            amount: "",
            address: ""
        });

        setTokenData({
            ...tokenData,
            initial_balances: initial_balances
        })
    }

    const onInitialBalanceValueChange = (event: any, index: number) => {
        let initial_balance = tokenData.initial_balances[index];
        initial_balance = {
            ...initial_balance,
            [event.target.id]: event.target.value
        };
        tokenData.initial_balances[index] = initial_balance;
        setTokenData(tokenData)
    }

    const onClickRemoveInitialBalance = (index: number) => {
        let initial_balances = tokenData.initial_balances;
        initial_balances.splice(index,1);
        setTokenData({
            ...tokenData,
            initial_balances: initial_balances
        })
    }


    return (
        <Card className="NewTokenForm">
            <CardHeader title="Create a token" />
            <CardContent className="CardContent">
                <Grid container
                    spacing={6}
                    marginBottom="2em">
                    <Grid item xs={6}>
                        <TextField fullWidth
                            id="name"
                            type="text"
                            label="Name"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            defaultValue={tokenData.name} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField fullWidth
                            id="symbol"
                            type="text"
                            label="Symbol"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            defaultValue={tokenData.symbol} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField fullWidth
                            id="decimals"
                            type="number"
                            label="Decimals"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            defaultValue={tokenData.decimals} />
                    </Grid>
                    <Grid spacing={6} container item xs={6}>
                        <Grid item xs={12}>
                            <TextField fullWidth
                                id="cap"
                                type="text"
                                label="Cap"
                                onChange={(event) => onValueChange(event)}
                                variant="standard"
                                defaultValue={tokenData.cap} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth
                                id="project"
                                type="text"
                                label="Project Name"
                                onChange={(event) => onValueChange(event)}
                                variant="standard"
                                defaultValue={tokenData.project} />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth
                            id="description"
                            type="text"
                            label="Project Description"
                            onChange={(event) => onValueChange(event)}
                            variant="standard"
                            defaultValue={tokenData.description}
                            multiline />
                    </Grid>
                    <Grid item xs={12} marginBottom="1em">
                        <TextField fullWidth
                            id="logo"
                            type="text"
                            label="Token Logo URL"
                            onChange={(event) => onValueChange(event)}
                            variant="standard"
                            defaultValue={tokenData.logo} />
                    </Grid>
                </Grid>
                <h3 className="SubHeaderTitle">Initial balance distribution</h3>
                {tokenData.initial_balances.map((initialBalance, index) => (
                    <Grid container
                        spacing={4}
                        paddingLeft="2em"
                        paddingRight="2em"
                        key={index}>
                        <Grid item
                            xs={1}
                            className="InitialBalanceRemoveItem">
                                {index !== 0 && 
                                    <Button disableRipple
                                        onClick={() => onClickRemoveInitialBalance(index)}>
                                        <PlaylistRemove />
                                    </Button>
                                }
                        </Grid>
                        <Grid item xs={8}>
                            <TextField fullWidth
                                id="address"
                                type="text"
                                label="Address"
                                onChange={(event) => onInitialBalanceValueChange(event, index)}
                                variant="standard"
                                defaultValue={initialBalance.address}
                                required/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth
                                id="amount"
                                type="number"
                                label="Amount"
                                onChange={(event) => onInitialBalanceValueChange(event, index)}
                                variant="standard"
                                defaultValue={initialBalance.amount}
                                required/>
                        </Grid>
                    </Grid>
                ))}
            </CardContent>
            <CardActions className="CardActions">
                <Button className="IncreaseInitialBalanceAction"
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={onIncreaseInitialBalance}
                    disableRipple>Add address to initial distribution</Button>
                <Button className="SubmitActionButton"
                    variant="contained"
                    startIcon={<Add />}
                    onClick={submitCreateToken}
                    disableRipple>Create Token</Button>
            </CardActions>
        </Card>
    )
}

export default NewTokenForm;