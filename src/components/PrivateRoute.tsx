import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";
import { useSelector } from "react-redux";

function PrivateRoute() {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
}

export default PrivateRoute;
