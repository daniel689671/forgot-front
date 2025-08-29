import React, { useEffect, useState } from "react";
import arrow from "../assets/Images/arrow_left.png";
import arrowdown from "../assets/Images/expand.png";
import { useNavigate } from "react-router-dom";
import countriesData from "../components/data/countries.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPass = () => {
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCountries(countriesData);
    const defaultCountry =
      countriesData.find((country) => country.code === "NG") ||
      countriesData[0];
    setSelected(defaultCountry);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullNumber = `+${selected?.callingCodes?.[0] || ""}${phone}`;
    console.log("Submitted number:", fullNumber);

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/auth/send-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullNumber }), // send full number
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      toast.success(data.message); // Show success toaster

      localStorage.setItem("resetPhone", fullNumber);

      setTimeout(() => {
        navigate("/PassWords");
      }, 1500); // Wait for toast before navigating
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center 
             px-[20px] py-[15px] 
             max-w-md mx-auto 
             md:max-w-2xl md:py-10 md:px-12 lg:max-w-3xl"
      >
        <div className="flex items-center  mb-8">
          <img
            src={arrow}
            alt="back"
            className="mr-2 text-black cursor-pointer"
            onClick={() => navigate("/login")}
          />
          <h2 className="text-lg font-semibold pt-6 md:text-2xl lg:text-3xl">
            Forgot Password
          </h2>
        </div>

        {/* phone input */}
        <div className="flex flex-col items-start mb-4 w-full ">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700 md:text-base"
          >
            Phone Number
          </label>

          <div
            className="flex items-center gap-3 
                    border border-[#E5E7EB] rounded-lg 
                    p-5 h-12 w-full mt-4 relative 
                    md:h-14 md:p-6"
          >
            {selected && (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img src={selected.flag} alt="" className="w-5 h-5 mr-2" />
                <span className="text-gray-500 mr-1">
                  +{selected.callingCodes && selected.callingCodes[0]}
                </span>
                <img src={arrowdown} alt="dropdown" />
              </div>
            )}

            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="ex : 81234567890"
              className="flex-1 outline-none text-sm placeholder-gray-400"
              value={phone}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setPhone(onlyNums);
              }}
            />

            {/* dropdown */}
            {showDropdown && (
              <div className="absolute z-50 bg-white border mt-52 rounded-md shadow-md max-h-60 overflow-auto w-full">
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setSelected(country);
                      setShowDropdown(false);
                    }}
                  >
                    <img
                      src={country.flag}
                      alt={`Flag of ${country.name}`}
                      className="w-5 h-5"
                    />
                    <span className="text-xs text-gray-700">
                      {country.name}
                    </span>
                    <span className="text-xs ml-auto text-gray-500">
                      {country.callingCode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-3 pl-5 text-[15px] md:text-base">
            We'll call or text you to confirm your number. Standard message and
            data rates apply
          </p>
        </div>

        <div className="mt-3 px-4">
          <button
            type="submit"
            className="h-12 w-full bg-yellow-600 text-white rounded-lg font-semibold text-base 
                 disabled:opacity-50 md:h-14 md:text-lg lg:h-16 lg:text-xl"
            disabled={loading}
          >
            {loading ? "Sending..." : "Continue"}
          </button>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="text-sm text-gray-500 underline  md:text-base"
            >
              Need help?
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ResetPass;
