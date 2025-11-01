import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserDataContext.jsx";
import axios from "axios"
import MainLogo from "../assests/Logo.png";
import { Eye, EyeOff } from "lucide-react";

export const UserLogin = () => {

    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {setuser} = useContext(UserDataContext)
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
            <div className="p-7 flex h-screen flex-col justify-between bg-primary">
                <div>
                    <img className="w-16 mb-8" src={MainLogo}/>
                    <form
                        onSubmit={SubmitHandler}
                    >
                        <h3 className="text-lg font-medium mb-2 text-text-primary">What's your email</h3> 
                        <input 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="bg-secondary text-text-primary border-border-color mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-text-secondary"
                            placeholder="email@exmaple.com"
                        />

                        <h3 className="text-lg font-medium mb-2 text-text-primary">Enter Password</h3>

                        <div className="relative">
                            <input 
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                className="bg-secondary text-text-primary border-border-color mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-text-secondary"
                                placeholder="password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary -top-4"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        <button className="w-full bg-accent text-on-accent font-semibold py-3 rounded mt-6">Login</button>

                        <p className="text-center mt-4 text-text-secondary">
                            New here?
                            <Link
                                className="ml-2 text-accent hover:underline"
                                to='/user-signup'
                            >
                                Create new Account
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-secondary text-text-primary font-semibold py-3 rounded mb-6 border border-[#2563EB]" to="/captain-login">Sign in as Captain</Link>
                </div>
            </div>
        </>
    )
}