"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EmailIconUrl from "@Image/EmailIcon.svg";
import PersonIconUrl from "@Image/PersonIcon.svg";
import PasswordIconUrl from "@Image/PasswordIcon.svg";

const CreateAccountForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handler = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      // if (confirmPassword !== password) {
      //   alert("password is not matched");
      //   return;
      // }
      const payload = { email, password };
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/register`;
      const response = await axios.post(endpoint, payload);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Please check the console log.");
    }
  };

  return (
    <form
      onSubmit={handler}
      className="mt-5 flex flex-col gap-10 justify-center items-center w-full"
    >
      <div className="relative w-full h-8">
        <Image
          className="absolute left-2 top-[75%] transform -translate-y-1/2 text-lg text-gray-500"
          src={PersonIconUrl}
          alt="p"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Name"
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 shadow-md text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 ease-in-out"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="relative w-full h-8">
        <Image
          className="absolute left-2 top-[75%] transform -translate-y-1/2 text-lg text-gray-500"
          src={EmailIconUrl}
          alt="email"
          width={20}
          height={20}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 shadow-md text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 ease-in-out"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="relative w-full h-8">
        <Image
          className="absolute left-2 top-[75%] transform -translate-y-1/2 text-lg text-gray-500"
          src={PasswordIconUrl}
          alt="lock"
          width={20}
          height={20}
        />
        <input
          type="password"
          placeholder="password"
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 shadow-md text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 ease-in-out"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="mt-[10%] border border-[#5B7AFC] bg-[#5B7AFC] text-white py-[1.5%] px-[10%] rounded-full hidden md:block"
      >
        Sign up
      </button>
    </form>
  );
};

export default CreateAccountForm;
