import "./Layout.scss";
import TokenIcon from '@mui/icons-material/Token';
import { AppBar, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ConnectWalletButton from '../ConnectWalletButton';
import { useEffect, useState } from "react";

type Props = {
    menu: Array<{
        path: string;
        element: JSX.Element;
        title: string;
        icon: JSX.Element;
    }>,
    routesList: Array<{
        path: string;
        element: JSX.Element;
        title: string;
    }>
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null,
};

function Layout(props: Props) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [title, setTitle] = useState("");

    useEffect(() => {
        props.routesList.forEach( page => {
            if (pathname === page.path){
                return setTitle(page.title);
            } else if(pathname.lastIndexOf("/") > 1){
                const fixPath = pathname.slice(0, pathname.lastIndexOf("/"));

                if(fixPath+"/:id" === page.path){
                    return setTitle(page.title);
                }
            }
        })

    }, [pathname])

    const onNavigateToPage = (event: any, index: number) => {
        event?.preventDefault();
        let page = props.menu[index];
        navigate(page.path);
        setTitle(page.title);
    }

    return (
        <div className="AppLayout">
            <AppBar className="AppNavbar" position="static">
                <List className="NavbarList">
                    <NavLink className="NavLink" to="/">
                        <ListItem className="AppLogo">
                            <TokenIcon className="AppIcon" />
                            <Typography variant="subtitle1">
                                Token <b>Factory</b>
                            </Typography>
                        </ListItem>
                    </NavLink>
                    {props.menu.map((menuItem, index) => (
                        <ListItem key={index}
                            className="NavItem"
                            disablePadding>
                            <NavLink className="NavLink"
                                to={menuItem.path}
                                onClick={(event) => onNavigateToPage(event, index)}
                                style={({ isActive }) => (isActive ? { color: '#439cf4' } : {})}>
                                <ListItemButton className="NavButton">
                                    {menuItem.icon}
                                    <ListItemText primary={menuItem.title} />
                                </ListItemButton>
                            </NavLink>
                        </ListItem>
                    ))}
                </List>
            </AppBar>

            <div className="AppBody">
                <AppBar className="AppHeader" position="static">
                    <Toolbar className="AppToolbar">
                        <span>{title}</span>
                        <ConnectWalletButton />
                    </Toolbar>
                </AppBar>
                <div className="AppContent">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Layout;
