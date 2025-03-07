import { useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import { createPortal } from "react-dom";

const ModalPortal = ({ children, selector, show }: any) => {
  const ref: any = useRef(null);
  useEffect(() => {
    ref.current = document.getElementById(selector);
  }, [selector]);
  return show && ref.current ? createPortal(children, ref.current) : null;
};

export default ModalPortal;

export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});