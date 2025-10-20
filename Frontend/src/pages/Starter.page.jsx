import { Link } from "react-router-dom";

export const Starter = () => {
  return (
    <>
      <div className="relative bg-green-100 h-screen w-full flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 left-0 w-44 h-44 bg-red-100 border-[1px] border-black rounded-br-full"></div>
        <div className="absolute bottom-40 right-0 w-44 h-44 bg-blue-100 border-[1px] border-black rounded-tl-full"></div>

        <img
          className="w-16 mt-8 ml-8 z-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />

        <div className="bg-white p-8 rounded-t-lg shadow-2xl z-10">
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
    </>
  );
};
