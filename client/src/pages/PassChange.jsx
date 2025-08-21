import React from "react";
import succ from "../assets/Images/check_circle.png";
import { Link } from "react-router-dom";

const PassChange = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-screen px-4">
      <img src={succ} alt="" className="" />
      <h2 className="text-xl font-extrabold text-[gray] mb-2">
        Password Changed
      </h2>
      <p className="text-sm text-[gray] mb-8">
        Your password has been changed successfully.
      </p>
      <Link
        to={"/Login"}
        className="h-12 w-full bg-[#FBBF24] text-white rounded-lg py-3 font-semibold text-base"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default PassChange;
