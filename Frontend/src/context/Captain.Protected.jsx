import { Navigate, useLocation } from "react-router-dom";

export const CaptainProtectedWrapper = ({children}) => {

    const token = localStorage.getItem('token')
    const location = useLocation();

    if(!token){
        return(
            <Navigate
                to="/captain-login"
                replace
                state={{from : location}}
            />
        )
    }

    return children
}