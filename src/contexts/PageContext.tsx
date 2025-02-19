import { createContext } from "react";

const pageContext = {
    isLoginPageContext: false,
    isRegisterPageContext: false
}

export const PageContext = createContext(pageContext);
