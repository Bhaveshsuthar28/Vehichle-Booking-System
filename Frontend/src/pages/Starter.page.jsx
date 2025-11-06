import { Link } from "react-router-dom";
import MainLogo from "../assests/Logo.png";

export const Starter = () => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
      <img
        src="https://files.123freevectors.com/wp-content/original/107763-royal-blue-abstract.jpg"
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <img
        className="w-20 mt-8 ml-8 z-10 relative"
        src={MainLogo}
        alt="Logo"
      />

      <div className="relative bg-white px-8 py-16 rounded-t-3xl shadow-2xl z-10">
        <h2 className="text-2xl font-bold text-black text-center">
          Get Started with Uber
        </h2>
        <Link
          to="/user-login"
          className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5 hover:bg-gray-900 transition"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};
