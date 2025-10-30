import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserDataContext.jsx";
import axios from "axios"

export const UserLogin = () => {

    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');

    const {user , setuser} = useContext(UserDataContext)
    const navigate = useNavigate();

    const SubmitHandler = async(e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password : password
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login` , userData);

        if(response.status === 200){
            const data = response.data;
            setuser(data.user);
            localStorage.setItem('userToken', data.token)
            navigate('/home')
        }
        setemail('');
        setpassword('');
    }

    return(
        <>
            <div className="p-7 flex h-screen flex-col justify-between">
                <div>
                    <img className="w-16 mb-8" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
                    <form
                        onSubmit={SubmitHandler}
                    >
                        <h3 className="text-lg font-medium mb-2">What's your email</h3> 
                        <input 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                            placeholder="email@exmaple.com"
                        />

                        <h3 className="text-lg font-medium mb-2 ">Enter Password</h3>

                        <input 
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                            placeholder="password"
                        />

                        <button className="w-full bg-black text-white font-semibold py-3 rounded mt-5">Login</button>

                        <p className="text-center mt-2">
                            New here?
                            <Link
                                className="ml-2 text-blue-600 hover:underline"
                                to='/user-signup'
                            >
                                Create new Account
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-[#10b461] text-white font-semibold py-3 rounded mt-5" to="/captain-login">Sign in as Captain</Link>
                </div>
            </div>
        </>
    )
}