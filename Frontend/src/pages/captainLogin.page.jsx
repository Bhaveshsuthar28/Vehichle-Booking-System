import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react";
import { CaptainDataContext} from "../context/UserDataContext.jsx";
import axios from "axios";

export const CaptainLogin = () => {
    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
    
    const {captain , setCaptain} = useContext(CaptainDataContext)

    const navigate = useNavigate();

    const SubmitHandler = async (e) => {
        e.preventDefault();
        const Capatain = {
            email: email,
            password : password
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/login`, Capatain);

        if(response.status === 201){
            const data = response.data;
            setCaptain(data.captain);
            localStorage.setItem('captainToken', data.token)
            navigate('/captain-home')
        }
        setemail('');
        setpassword('');
    }

    return(
        <>
            <div className="p-7 flex h-screen flex-col justify-between">
                <div>
                    <img className="w-16 mb-8" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
                    <h1 className="text-center text-3xl font-semibold text-blue-600 my-4">Welcome Captain</h1>
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
                            Join a fleet?
                            <Link
                                className="ml-2 text-blue-600 hover:underline"
                                to='/captain-signup'
                            >
                                Register as a Captain
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-[#10b461] text-white font-semibold py-3 rounded mt-5" to="/user-login">Sign in as User</Link>
                </div>
            </div>
        </>
    )
}