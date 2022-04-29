import { useRoutes } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import { LibraryAdd } from "@mui/icons-material";

/* PAGES */
import Token from "./pages/Token";
import Tokens from "./pages/Tokens";
import Info from "./pages/Info";
import CreateToken from "./pages/CreateToken";

import NotFound from "./pages/NotFound";

export const useNav = () => {
    const menu = [
        {
            path: "/tokens",
            element: <Tokens />,
            title: "Tokens List",
            icon: <ListIcon className="NavIcon" />,
        },
        {
            path: "/create-token",
            element: <CreateToken />,
            title: "Create Token",
            icon: <LibraryAdd className="NavIcon" />,
        }
    ]

    const routes = [
        {
            path: "/",
            element: <Info />,
            title: ""
        },
        ...menu,
        {
            path: "/tokens/:id",
            element: <Token />,
            title: "Token details"
        },
        /* 404 */
        { 
            path: "*", 
            element: <NotFound />,
            title: "Page Not Found"
        }
    ]

    return {
        menu,
        element: useRoutes(routes),
        routesList: routes
    }
}