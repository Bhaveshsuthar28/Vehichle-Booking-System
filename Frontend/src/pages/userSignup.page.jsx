import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react";
import axios from "axios"
import { UserDataContext } from "../context/UserDataContext.jsx";

export const UserSignUp = () => {

    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
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
            <div className="p-7 flex h-screen flex-col justify-between">
                <div>
                    <img className="w-16 mb-8" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
                    <form
                        onSubmit={SubmitHandler}
                    >
                        <h3 className="text-lg font-medium mb-2">What's your name</h3> 

                        <div className="flex gap-x-4">
                            <input 
                                required 
                                type="text" 
                                className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
                                placeholder="John"
                                value={firstname}
                                onChange={(e) => setfirstname(e.target.value)}
                            />

                            <input 
                                type="text" 
                                className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
                                placeholder="Doe"
                                value={lastname}
                                onChange={(e) => setlastname(e.target.value)}
                            />
                        </div>


                        <h3 className="text-lg font-medium mb-2">What's your email</h3> 
                        <input 
                            required 
                            type="email" 
                            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                            placeholder="email@exmaple.com"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />

                        <h3 className="text-lg font-medium mb-2 ">Enter Password</h3>

                        <input 
                            required
                            type="password"
                            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />

                        <button 
                            className="w-full bg-black text-white font-semibold py-3 rounded mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
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

                        <p className="text-center mt-2">
                            Already Joined?
                            <Link
                                className="ml-2 text-blue-600 hover:underline"
                                to='/user-login'
                            >
                                SignIn in Account
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-[#10b461] text-white font-semibold py-3 rounded mt-5" to="/captain-signup">Join Us as a Captain</Link>
                </div>
            </div>
        </>
    )
}