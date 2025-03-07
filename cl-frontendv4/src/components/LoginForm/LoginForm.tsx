"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import EmailIcon from "@Image/EmailIcon.svg";
import PasswordIcon from "@Image/PasswordIcon.svg";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handler = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const payload = { email, password };
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/login`;
      const response = await axios.post(endpoint, payload);
      await createSession(response.data);
      router.push("/caller-dashboard");
    } catch (error: any) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        alert(`Invalid Login: ${error.response?.data}`);
      }
    }
  };

  const createSession = async (accessToken: any) => {
    await axios
      .post("/api/login", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        localStorage.setItem("accessToken", accessToken);
      })
      .catch((err) => console.log(err));
  };

  return (
    <form
      onSubmit={handler}
      className="mt-5 flex flex-col gap-8 justify-center items-center w-full"
    >
      <div className="relative w-full h-8">
        <Image
          className="absolute left-2 top-[75%] transform -translate-y-1/2 text-lg text-gray-500"
          src={EmailIcon}
          alt="logo"
          width={20}
          height={20}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 shadow-md text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 ease-in-out"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="relative w-full h-8">
        <Image
          className="absolute left-2 top-[65%] transform -translate-y-1/2 text-lg text-gray-500"
          src={PasswordIcon}
          alt="logo"
          width={20}
          height={20}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 shadow-md text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 ease-in-out"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-end">
        <a href="/password-reset" className="text-blue-500 text-sm">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="mt-[15%] border border-[#5B7AFC] bg-[#5B7AFC] text-white py-[1.5%] px-[10%] rounded-full hidden md:block"
      >
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
