import { PageContext } from "../contexts/PageContext";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
    children: ReactNode
}

function PageProvider({children}: Props) {
    const [ isLoginPage, setIsLoginPage ] = useState(false);
    const [ isRegisterPage, setIsRegisterPage ] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login') {
            setIsLoginPage(true);
            setIsRegisterPage(false);
        } else if (location.pathname === '/register') {
            setIsLoginPage(false);
            setIsRegisterPage(true);
        } else {
            setIsLoginPage(false);
            setIsRegisterPage(false);
        }
    }, [location.pathname]);

    const pageContext = {
        isLoginPageContext: isLoginPage,
        isRegisterPageContext: isRegisterPage
    }

    return (
        <PageContext.Provider value={pageContext}>
            {children}
        </PageContext.Provider>
    );
}

export default PageProvider;
