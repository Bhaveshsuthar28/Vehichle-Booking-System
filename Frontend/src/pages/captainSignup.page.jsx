import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react";
import { CaptainDataContext } from "../context/UserDataContext.jsx";
import axios from "axios";
import MainLogo from "../assests/Logo.png";

export const CaptainSignUp = () => {

    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
    const [firstname , setfirstname] = useState('');
    const [lastname , setlastname] = useState('');
    const [vehiclecolor, setvehiclecolor] = useState('');
    const [plate, setplate] = useState('');
    const [capacity, setcapacity] = useState('');
    const [vehicletype, setvehicletype] = useState('');

    const {captain , setCaptain} = useContext(CaptainDataContext);
    const navigate = useNavigate();

    const SubmitHandler = async (e) => {
        e.preventDefault();
        
        const newCaptain = {
            fullname : {
                firstname : firstname,
                lastname : lastname
            },
            email: email,
            password : password,
            vehicle : {
                color : vehiclecolor,
                plate : plate,
                capacity : capacity,
                vehicleType : vehicletype
            }
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register` , newCaptain)

        if(response.status === 201){
            const data = response.data;

            setCaptain(data.captain);
            localStorage.setItem('captainToken',data.token);
            navigate('/captain-home')
        }

        setemail('');
        setpassword('');
        setfirstname('');
        setlastname('');
        setvehiclecolor('');
        setcapacity('');
        setvehicletype('');
        setplate('');
    }

    return(
        <>
            <div className="p-7 flex h-screen flex-col justify-between">
                <div>
                    <img className="w-16 mb-8" src={MainLogo}/>
                    <h1 className="text-center text-3xl font-semibold text-blue-600 my-4">Join Us Captain</h1>
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

                        <h3 className="text-lg font-medium mb-2">Vehicle details</h3>
                        <div className="flex gap-x-4">
                            <input
                                type="text"
                                required
                                className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
                                placeholder="Color"
                                value={vehiclecolor}
                                onChange={(e) => setvehiclecolor(e.target.value)}
                            />
                            <input
                                type="text"
                                required
                                className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
                                placeholder="Plate number"
                                value={plate}
                                onChange={(e) =>
                                    setplate(
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/[^A-Z0-9]/g, "")
                                    )
                                }
                            />
                        </div>
                        <div className="flex gap-x-4">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[1-9][0-9]*"
                                required
                                className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
                                placeholder="Capacity"
                                value={capacity}
                                onChange={(e) => {
                                    const sanitizedValue = e.target.value
                                        .replace(/\D/g, "")
                                        .replace(/^0+/, "");
                                    setcapacity(sanitizedValue);
                                }}
                            />
                            <select
                                required
                                className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-lg"
                                value={vehicletype}
                                onChange={(e) => setvehicletype(e.target.value.toLowerCase())}
                            >
                                <option value="" disabled>Select vehicle type</option>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>

                        <button className="w-full bg-black text-white font-semibold py-3 rounded mt-5">Join Us</button>

                        <p className="text-center mt-2">
                            Already Joined?
                            <Link
                                className="ml-2 text-blue-600 hover:underline"
                                to='/captain-login'
                            >
                                SignIn in Account
                            </Link>
                        </p>
                    </form>
                </div>
                <div>
                    <Link className="flex items-center justify-center w-full bg-[#10b461] text-white font-semibold py-3 rounded mt-5" to="/user-signup">Join Us as a User</Link>
                </div>
            </div>
        </>
    )
}