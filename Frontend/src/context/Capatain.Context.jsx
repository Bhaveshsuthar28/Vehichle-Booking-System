import { useState , useContext, Children } from "react";
import { CaptainDataContext } from "./UserDataContext.jsx";

export const useCaptain = () => {
    const context = useContext(CaptainContext);
    if(!context){
        throw new Error('use Captain must be within a CaptainProvider')
    }
    return context;
}

const CaptainContext = ({children}) => {
    const [captain , setCaptain] = useState(null);
    const [isloading , setisloading] = useState(false);
    const [error , seterror] = useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    }

    const value = {
        captain,
        setCaptain,
        isloading,
        setisloading,
        error,
        seterror,
        updateCaptain
    }

    return(
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    )
}

export default CaptainContext;
