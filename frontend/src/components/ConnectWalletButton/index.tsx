import { Button, Menu } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { ConnectType, useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { useState } from 'react';
import './ConnectWalletButton.scss';
import AddressComponent from './../AddressComponent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function ConnectWalletButton() {
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
        if (connectedWallet) disconnect()
        else setAnchorEl(event.currentTarget);
    };

    const handleConnect = (option: ConnectType) => {
        connect(option);
        setAnchorEl(null);
    };

    const handleInstall = (option: ConnectType) => {
        install(option);
        setAnchorEl(null);
    };

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
                        <AddressComponent maxWidth='120px' address={connectedWallet.terraAddress}/>
                    </>
                }
                <span>{!connectedWallet && "Connect"}</span>
            </Button>

            <Menu id="ConnectWalletOptions"
                MenuListProps={{
                    'aria-labelledby': 'ConnectWalletButtonMenu',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}>
                {availableInstallTypes.map((option) => (
                    <MenuItem key={option}
                        onClick={() => handleInstall(option)}>
                        {option}
                    </MenuItem>
                ))}

                {availableConnectTypes.map((option) => (
                    <MenuItem key={option}
                        onClick={() => handleConnect(option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default ConnectWalletButton;