"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleBackButtonClick = () => {
    router.back();
  };
  return (
    <>
      <button
        className="mt-[38%] border border-[#5B7AFC] bg-[#5B7AFC] text-white py-[1.5%] px-[15%] rounded-full hidden md:block"
        onClick={handleBackButtonClick}
      >
        Back
      </button>
    </>
  );
};

export default BackButton;
