import { useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import { createPortal } from "react-dom";

const ClientPortal = ({ children, selector, show }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = document.getElementById(selector);
  }, [selector]);
  return show && ref.current ? createPortal(children, ref.current) : null;
};

export default ClientPortal;

export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
