import "./Layout.scss";
import TokenIcon from '@mui/icons-material/Token';
import { AppBar, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { NavLink } from "react-router-dom";
import ConnectWalletButton from '../ConnectWalletButton';

type Props = {
  menu: Array<{
    path: string;
    element: JSX.Element;
    title: string;
    icon: JSX.Element;
  }>,
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null,
};

function Layout(props: Props) {

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
            <ConnectWalletButton/>
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
