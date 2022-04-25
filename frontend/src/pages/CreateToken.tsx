import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import NewTokenForm from "../components/NewTokenForm"
import { Token } from "../models/token";
import * as execute from "./../contract/execute";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function CreateToken() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
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

  const onCreateNewToken = async (token: Token): Promise<any> => {
    setLoading(true);
    try {
      const newTokenResponse = await execute.createNewToken(token, connectedWallet);

      if (newTokenResponse.logs) {
        const tokenId = newTokenResponse?.logs[0].events[4].attributes[3].value;
        enqueueSnackbar(`Token '${token.name}' successfully created`, {variant: "success"});
        navigate(`/tokens/${tokenId}`);
      }
      return newTokenResponse;
    }
    catch(e) {
      console.log(e);
      enqueueSnackbar(`${e}`, {variant: "error"});
    }
    setLoading(false);
  }

  return (
    <div className="Tokens">
      {loading && <Loader />}
      <NewTokenForm onCreateNewToken={onCreateNewToken} />
    </div>
  )
}
export default CreateToken;