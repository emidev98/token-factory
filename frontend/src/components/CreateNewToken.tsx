import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useState, useEffect, ButtonHTMLAttributes } from 'react'
import { factoryAddress } from "./../contract/address";
import { InitialBalances, Token, TokenUtils } from '../models/token';

type Props = {
    onCreateNewToken : (token: Token) => void;
};

function CreateNewToken(props: Props) {
    const connectedWallet = useConnectedWallet();
    const [tokenData, setTokenData] = useState({
        name: "Terra",
        symbol: "TER",
        decimals: 6,
        amount: "100000",
        initial_balances: new Array<InitialBalances>(),
        minter: "",
        cap: 1000000
    });

    useEffect(() => {
        const fetchWalletAddress = async () => {
          if (connectedWallet) {
              setTokenData({
                ...tokenData,
                minter: factoryAddress(connectedWallet)
              })
          }
        }
        fetchWalletAddress()
      }, [connectedWallet])

    const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
        event.target as HTMLTextAreaElement;
        setTokenData({
            ...tokenData,
            [event.currentTarget.id]: event.currentTarget.value
        })
    }

    const submitCreateToken = (event: any) => {
        event.preventDefault();
        const token = TokenUtils.fromTokenData(tokenData);
        props.onCreateNewToken(token)
    }

    return (
        <div className="CreateNewToken">
            <form style={{display : "flex", flexDirection: "column"}}>
                <label>Name:
                    <input id="name"
                        type="text" 
                        value={tokenData.name} 
                        onChange={onChangeInput}/>
                </label>
                <label>Symbol:
                    <input id="symbol"
                        type="text" 
                        value={tokenData.symbol} 
                        onChange={onChangeInput}/>
                </label>
                <label>Minter:
                    <input id="mint.minter"
                        type="text" 
                        value={tokenData.minter} 
                        onChange={onChangeInput}/>
                </label>
                <label>Cap:
                    <input id="mint.cap"
                        type="text" 
                        value={tokenData.cap} 
                        onChange={onChangeInput}/>
                </label>
                <label>Decimals:
                    <input id="decimals"
                        type="number" 
                        value={tokenData.decimals} 
                        onChange={onChangeInput}/>
                </label>
                <label>Amount:
                    <input id="amount"
                        type="number" 
                        value={tokenData.amount} 
                        onChange={onChangeInput}/>
                </label>
                <input type="submit" onClick={submitCreateToken} />
            </form>
        </div>
    )
}

export default CreateNewToken;