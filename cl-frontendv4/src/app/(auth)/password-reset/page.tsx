import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordResetForm from "@/components/PasswordReset/PasswordResetForm";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="h-screen flex flex-col items-center relative px-[5%] md:px-[20%] text-center">
        <button className="absolute top-8 right-8 border border-black rounded-full w-8 aspect-square flex items-center justify-center font-black shadow-md">
          X
        </button>
        <div className="mt-[20%] text-[#868DAC] text-[1.5rem] font-extrabold">
          Forgot Password
        </div>
        <div className="mt-10 wt-10">
          Please provide the email address that you used when you sign up for
          your account
        </div>
        <div className="mt-10">
          If you forgotyour email. Please{" "}
          <span className="text-[#0047FF]">
            {" "}
            <Link href={"#"}>Contact Us</Link>
          </span>
        </div>
        <PasswordResetForm />
      </div>
    </>
  );
};

const PageWithLayout: React.FC = () => (
  <AuthLayout
    title={"Reset your Password"}
    description={"Please provide us you email"}
    backButton={false}
  >
    <Page />
  </AuthLayout>
);

export default PageWithLayout;
