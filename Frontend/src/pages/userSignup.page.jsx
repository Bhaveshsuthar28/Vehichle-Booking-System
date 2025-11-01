import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react";
import axios from "axios"
import { UserDataContext } from "../context/UserDataContext.jsx";
import MainLogo from "../assests/Logo.png";
import { Eye, EyeOff } from "lucide-react";

export const UserSignUp = () => {

    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstname , setfirstname] = useState('');
    const [lastname , setlastname] = useState('');
    const [Userdata , setuserdata] = useState({});
    const [isSubmitting , setIsSubmitting] = useState(false);
    const { setuser } = useContext(UserDataContext)

    const navigate = useNavigate();

    const SubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const newUser = {
            fullname : {
                firstname : firstname,
                lastname : lastname
            },
            email: email,
            password : password
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, newUser)

            if(response.status === 201){
                const data = response.data;
                
                setuser(data.user)
                localStorage.setItem('userToken', data.token) 
                navigate('/home')
            }

            setemail('');
            setpassword('');
            setfirstname('');
            setlastname('');
        } catch (error) {
            console.error('Failed to register user:', error?.response?.data || error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <>
            <div className="p-7 flex h-screen flex-col justify-between bg-primary">
                <div>
                    <img className="w-16 mb-8" src={MainLogo}/>
                    <form
                        onSubmit={SubmitHandler}
                    >
                        <h3 className="text-lg font-medium mb-2 text-text-primary">What's your name</h3> 

                        <div className="flex gap-x-4">
                            <input 
                                required 
                                type="text" 
                                className="bg-secondary text-text-primary border-border-color mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-text-secondary"
                                placeholder="John"
                                value={firstname}
                                onChange={(e) => setfirstname(e.target.value)}
                            />

                            <input 
                                type="text" 
                                className="bg-secondary text-text-primary border-border-color mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-text-secondary"
                                placeholder="Doe"
                                value={lastname}
                                onChange={(e) => setlastname(e.target.value)}
                            />
                        </div>


                        <h3 className="text-lg font-medium mb-2 text-text-primary">What's your email</h3> 
                        <input 
                            required 
                            type="email" 
                            className="bg-secondary text-text-primary border-border-color mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-text-secondary"
                            placeholder="email@exmaple.com"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />

                        <h3 className="text-lg font-medium mb-2 text-text-primary">Enter Password</h3>

                        <div className="relative">
                            <input 
                                required
                                type={showPassword ? "text" : "password"}
                                className="bg-secondary text-text-primary border-border-color mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-text-secondary"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        <button 
                            className="w-full bg-accent text-on-accent font-semibold py-3 rounded mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing...
                                </span>
                            ) : (
                                'Join Us'
                            )}
                        </button>

                        <p className="text-center mt-2 text-text-secondary">
                            Already Joined?
                            <Link
                                className="ml-2 text-accent hover:underline"
                                to='/user-login'
                            >
                                SignIn in Account
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-secondary text-text-primary font-semibold py-3 rounded mt-5 border border-[#2563EB]" to="/captain-signup">Join Us as a Captain</Link>
                </div>
            </div>
        </>
    )
}