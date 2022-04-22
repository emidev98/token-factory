import { useRoutes } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import { Add, Create, Whatshot } from "@mui/icons-material";

/* PAGES */ 
import Tokens from "./pages/Tokens";
import Dashboard from "./pages/Dashboard";
import CreateToken from "./pages/CreateToken";
import Mint from "./pages/Mint";
import Burn from "./pages/Burn";

import NotFound from "./pages/NotFound";

export const useNav = () => {
  const menu = [
    {
      path: "/tokens",
      element: <Tokens />,
      title: "Tokens",
      icon: <ListIcon className="NavIcon"/>,
    },
    {
      path: "/create-token",
      element: <CreateToken />,
      title: "Create Token",
      icon: <Create className="NavIcon"/>,
    },
    {
      path: "/mint",
      element: <Mint />,
      title: "Mint Token",
      icon: <Add className="NavIcon"/>,
    },
    {
      path: "/burn",
      element: <Burn />,
      title: "Burn Token",
      icon: <Whatshot className="NavIcon"/>,
    },
  ]

  const routes = [
    {
      path: "/",
      element: <Dashboard />,
    },
    ...menu,
    /* 404 */
    { path: "*", element: <NotFound /> },
  ]

  return { menu, element: useRoutes(routes) }
}