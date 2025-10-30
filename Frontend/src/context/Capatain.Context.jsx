import { useState  , useCallback , useEffect} from "react";
import { CaptainDataContext } from "./UserDataContext.jsx";
import axios from "axios"

const CaptainContext = ({children}) => {
    const [captain , setCaptain] = useState(null);
    const [isloading , setisloading] = useState(false);
    const [error , seterror] = useState(null);

    const CAPTAIN_TOKEN_KEY = 'captainToken';

    const updateCaptain = useCallback(async () => {
        const token = localStorage.getItem(CAPTAIN_TOKEN_KEY);
        if (!token) {
            setCaptain(null);
            return;
        }
        setisloading(true);
        seterror(null);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captains/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCaptain(response.data);
        } catch (error) {
            seterror(error?.response?.data?.message ?? error.message);
            setCaptain(null);
        } finally {
            setisloading(false);
        }
    }, []);

    useEffect(() => {
        updateCaptain();
    }, [updateCaptain]);

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
