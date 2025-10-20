import { Navigate, useLocation } from "react-router-dom";

export const UserProtectedWrapper = ({children}) => {

    const token = localStorage.getItem('token')
    const location = useLocation();

    if(!token){
        return(
            <Navigate
                to="/user-login"
                replace
                state={{from : location}}
            />
        )
    }

    return children
}