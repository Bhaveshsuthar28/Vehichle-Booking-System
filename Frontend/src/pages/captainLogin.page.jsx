import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CaptainDataContext} from "../context/UserDataContext.jsx";
import axios from "axios";
import MainLogo from "../assests/Logo.png";
import { Eye, EyeOff } from "lucide-react";

export const CaptainLogin = () => {
    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
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
            <div className="p-7 flex h-screen flex-col justify-between bg-primary">
                <div>
                    <img className="w-16 mb-8" src={MainLogo} />
                    <h1 className="text-center text-3xl font-semibold text-accent my-4">Welcome Captain</h1>
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
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        <button className="w-full bg-accent text-on-accent font-semibold py-3 rounded mt-5">Login</button>

                        <p className="text-center mt-2 text-text-secondary">
                            Join a fleet?
                            <Link
                                className="ml-2 text-accent hover:underline"
                                to='/captain-signup'
                            >
                                Register as a Captain
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-secondary text-text-primary font-semibold py-3 rounded mt-5 border border-[#2563EB]" to="/user-login">Sign in as User</Link>
                </div>
            </div>
        </>
    )
}