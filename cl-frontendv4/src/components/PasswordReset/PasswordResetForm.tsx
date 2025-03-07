"use client";
import Link from "next/link";
import LoginForm from "@/components/LoginForm/LoginForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgotPassword = (event: any) => {
    event.preventDefault();
    console.log("handleForgotPassword");
    router.back();
  };
  return (
    <>
      <div className="w-full">
        <input
          type="email"
          placeholder="Username or Email"
          className="w-[80%] mt-10 pl-4 pr-4 py-3  rounded-lg bg-gray-100 shadow-md text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 ease-in-out"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        className="mt-10 border border-[#5B7AFC] bg-[#5B7AFC] text-white py-[1.5%] px-[10%] rounded-full"
        onClick={handleForgotPassword}
      >
        Submit
      </button>
    </>
  );
};

export default PasswordResetForm;
