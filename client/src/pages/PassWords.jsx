import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PassWords = () => {
  const inputs = useRef([]);
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const phone = localStorage.getItem("resetPhone");
  const navigate = useNavigate();

  const handleInput = (num, index) => {
    num.target.value = num.target.value.replace(/[^0-9]/g, "");
    setIsValid(null);
    setError("");

    if (num.target.value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }

    const code = inputs.current.map((input) => input.value).join("");
    if (code.length === 5 && code.split("").every((c) => c !== "")) {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  const handleKeyDown = (num, index) => {
    if (num.key === "Backspace" && !num.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const code = inputs.current.map((input) => input.value).join("");
    if (code.length !== 5) {
      setError("Please enter a valid 5-digit code.");
      setIsValid(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/auth/verify-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsValid(true);
        //  keep resetPhone for Reset Password page
        navigate("/passok");
      } else {
        setIsValid(false);
        setError(data.error || "Invalid reset code.");
        setTimeout(() => {
          inputs.current.forEach((input) => (input.value = ""));
          inputs.current[0].focus();
        }, 1000);
      }
    } catch (err) {
      setError("Server error. Please try again.");
      setIsValid(false);
    }

    setLoading(false);
  };

  // Auto focus first input
  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className=" bg-white w-full flex flex-col justify-between items-start gap-4 mt-7 px-5 ">
      <h2 className="text-xl font-semibold text-gray-900 ">
        Confirm your number
      </h2>
      <p className="text-sm text-gray-600 ">
        Enter the code we sent over SMS to{" "}
        <span className="font-medium text-gray-800">{phone}</span>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between space-x-4 mb-2">
          {[...Array(5)].map((_, index) => (
            <input
              key={index}
              type="text"
              ref={(el) => (inputs.current[index] = el)}
              inputMode="numeric"
              maxLength={1}
              onPaste={(e) => e.preventDefault()}
              className={`w-12 h-12 text-xl text-center border rounded-lg focus:outline-none ${
                isValid === null
                  ? "border-gray-300"
                  : isValid
                  ? "border-green-700"
                  : "border-red-700"
              }`}
              onInput={(num) => handleInput(num, index)}
              onKeyDown={(num) => handleKeyDown(num, index)}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <p className="text-sm text-gray-600">
          Didn't get an SMS?
          <a
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              if (cooldown === 0) {
                try {
                  await fetch(
                    "http://localhost:4000/api/auth/send-reset-code",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ phone }),
                    }
                  );
                  setCooldown(30);
                } catch {
                  alert("Failed to resend code.");
                }
              }
            }}
            className={`ml-1 underline font-medium ${
              cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-800"
            }`}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Send again"}
          </a>
        </p>

        <div className="mt-3 px-4 w-full space-y-4">
          <button
            type="submit"
            disabled={loading}
            className={`h-12 w-full rounded-xl font-semibold text-base 
              ${loading ? "bg-gray-400" : "bg-[#FBBF24] hover:bg-yellow-500"} 
              text-white`}
          >
            {loading ? "Checking..." : "Confirm Code"}
          </button>

          <div className="flex justify-end mt-4">
            <button type="button" className="text-sm text-gray-500 underline">
              Need a help?
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PassWords;
