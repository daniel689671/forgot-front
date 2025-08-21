import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../assets/Images/arrow_left.png";
import com from "../assets/Images/visibility.png";

const PassOk = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ Phone will be automatically loaded from localStorage
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("resetPhone");
    if (!storedPhone) {
      // If no phone is found, go back to start
      navigate("/");
    } else {
      setPhone(storedPhone);
    }
  }, [navigate]);

  const handSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 7) {
      return setError("Password must be at least 7 characters long.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      // ✅ Clear everything once successful
      setNewPassword("");
      setConfirmPassword("");
      localStorage.removeItem("resetPhone");

      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => {
        navigate("/PassChange");
      }, 1500);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-7.5 rounded-2xl flex flex-col gap-8">
      <div className="flex items-center">
        <img
          src={arrow}
          alt="back"
          className="mr-2 text-black cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h2>Reset Password</h2>
      </div>

      <form
        onSubmit={handSubmit}
        className="w-full flex flex-col gap-6 items-start"
      >
        {/* New Password */}
        <div className="w-full flex flex-col gap-2 items-start">
          <label htmlFor="new-password">New Password</label>
          <div className="relative w-full">
            <input
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none 
                ${
                  error?.toLowerCase().includes("password")
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
              placeholder="Enter new password"
            />
            <img
              src={com}
              alt="toggle visibility"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="w-full flex flex-col gap-2 items-start">
          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none 
                ${
                  error?.toLowerCase().includes("match")
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
              placeholder="Confirm new password"
            />
            <img
              src={com}
              alt="toggle visibility"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm -mt-2">{error}</p>}

        {/* Success Message */}
        {success && <p className="text-green-600 text-sm -mt-2">{success}</p>}

        {/* Submit Button */}
        <div className="mt-3 px-4 w-full">
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg font-semibold cursor-pointer bg-[#FBBF24] text-white disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassOk;
