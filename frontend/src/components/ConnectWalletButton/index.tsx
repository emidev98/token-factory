import { Button, Menu } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { ConnectType, useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { useState } from 'react';
import './ConnectWalletButton.scss';
import AddressComponent from './../AddressComponent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

function ConnectWalletButton() {
    const { enqueueSnackbar } = useSnackbar();
    const {
        availableConnectTypes,
        availableInstallTypes,
        connect,
        install,
        disconnect,
    } = useWallet()
    const connectedWallet = useConnectedWallet();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleConnect = (option: ConnectType) => {
        connect(option);
        setAnchorEl(null);
    };

    const handleInstall = (option: ConnectType) => {
        install(option);
        setAnchorEl(null);
    };

    const onCopyAddress = () => {
        if (connectedWallet) {
            navigator.clipboard.writeText(connectedWallet.terraAddress);
            enqueueSnackbar(`Address copied successfully`, { variant: "success" });
            setAnchorEl(null);
        }
    }

    const onDisconnectWallet = () => {
        disconnect();
        setAnchorEl(null);
    }

    return (
        <div className="ConnectWalletButton">
            <Button id="ConnectWalletButtonMenu"
                variant="outlined"
                aria-controls={open ? 'ConnectWalletOptions' : undefined}
                aria-expanded={open ? 'true' : undefined}
                disableRipple
                onClick={handleClick}>
                {connectedWallet && <>
                    <AccountBalanceWalletIcon fontSize="inherit" />
                    <AddressComponent maxWidth='120px' address={connectedWallet.terraAddress} />
                </>
                }
                <span>{!connectedWallet && "Connect"}</span>
            </Button>

            <Menu id="ConnectWalletOptions"
                MenuListProps={{ 'aria-labelledby': 'ConnectWalletButtonMenu' }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}>
                {!connectedWallet && availableConnectTypes.map((option) => (
                    <MenuItem key={option}
                        onClick={() => handleConnect(option)}>
                        {option}
                    </MenuItem>
                ))}


                {!connectedWallet && availableInstallTypes.map((option) => (
                    <MenuItem key={option}
                        onClick={() => handleInstall(option)}>
                        {option}
                    </MenuItem>
                ))}

                {connectedWallet && [
                    <MenuItem key="random1" onClick={() => onCopyAddress()}>
                        <span className="CopyEntry">
                            <ContentCopyIcon />
                            <span>Copy Address</span>
                        </span>
                    </MenuItem>,
                    <MenuItem key="random2" onClick={() => onDisconnectWallet()}>
                        Disconnect
                    </MenuItem>
                ]}
            </Menu>
        </div>
    );
}

export default ConnectWalletButton;