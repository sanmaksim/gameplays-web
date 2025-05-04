import { createContext } from "react";

const pageContext = {
    isLoginPageContext: false,
    isRegisterPageContext: false,
    currentPath: "",
    previousPath: ""
}

export const PageContext = createContext(pageContext);
