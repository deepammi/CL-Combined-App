import Link from "next/link";
import LoginForm from "@/components/LoginForm/LoginForm";

const Login = () => {
  return (
    <>
      <div className="h-screen flex flex-col items-center relative">
        <button className="absolute top-8 right-8 border border-black rounded-full w-8 aspect-square flex items-center justify-center font-black shadow-md">
          X
        </button>
        <div className="mt-[10%] text-[#868DAC] text-[1.5rem] font-extrabold">
          Sign in to TBI Corp.
        </div>
        <div className="mt-8 flex gap-4 text-[1.2rem]">
          <Link href={"#"} className="border border-black rounded-full w-8 aspect-square flex items-center justify-center font-black text-[1.2rem]">
            F
          </Link>
          <Link href={"#"} className="border border-black rounded-full w-8 aspect-square flex items-center justify-center font-black text-[1.2rem]">
            G
          </Link>
          <Link href={"#"} className="border border-black rounded-full w-8 aspect-square flex items-center justify-center font-black text-[1rem]">
            In
          </Link>
        </div>
        <div className="mt-10">
          or use your email account
        </div>
        <div className="mt-8 w-[50%]">
          <LoginForm />
        </div>
        <div className="mt-10 text-[#0047FF]">
          <Link href="/register">New register here !</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
