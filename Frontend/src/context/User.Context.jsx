import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { UserDataContext } from "./UserDataContext.jsx"

const UserContext = ({children}) => {
    const [user , setuser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const USER_TOKEN_KEY = 'userToken';

    const loadProfile = useCallback(async () => {
        const token = localStorage.getItem(USER_TOKEN_KEY);
        if (!token) {
            setuser(null);
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setuser(data);
        } catch (error) {
            console.log(error.message)
            setuser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const value = { user, setuser, isLoading, loadProfile };

    return(
        <div>
            <UserDataContext.Provider value={value}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext;