import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";
import mailIconUrl from "@Image/FooterMailIcon.svg";
import phoneIconUrl from "@Image/FooterPhoneIcon.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <></>
    // <div className="p-[3%] font-dm-sans bg-[url('/Image/FooterBgMD.svg')] md:bg-[url('/Image/FooterBgMD.svg')]">
    //   <Row justify={"space-around"} gutter={[10, 20]}>
    //     <Col span={24} md={8}>
    //       <div className="flex flex-col items-center">
    //         <div className="text-[1.8rem] font-medium text-black mb-[3%]">
    //           TBI Corp
    //         </div>
    //         <div className="w-[60%] flex flex-col items-center text-[#2E3C51] text-[1rem] text-center gap-4 font-[450]">
    //           <div>
    //             A leading Silicon Valley pioneer in AI automation of enterprise
    //             PreSales
    //           </div>
    //           <div className="flex gap-2 items-center">
    //             <Image src={mailIconUrl} alt="icon" className="w-[1rem]" />
    //             <div>info@tbicorp.com</div>
    //           </div>
    //           <div className="flex gap-2">
    //             <Image src={phoneIconUrl} alt="icon" className="w-[1rem]" />
    //             <div>408-418-8163</div>
    //           </div>
    //         </div>
    //       </div>
    //     </Col>
    //     <Col span={24} md={8} style={{}}>
    //       <div className="flex flex-col items-center">
    //         <div className="text-[1.5rem] font-medium text-black mb-[3%]">
    //           Pages
    //         </div>
    //         <div className="w-[60%] flex flex-col items-center text-center text-[1rem] gap-4 text-[#2E3C51] font-[450]">
    //           <Link href={"/"} className="text-inherit">
    //             <div>Home</div>
    //           </Link>
    //           <Link href={"#"} className="text-inherit">
    //             <div>About us</div>
    //           </Link>
    //           <Link href={"#"} className="text-inherit">
    //             <div>Integrations</div>
    //           </Link>
    //           <Link href={"/#pricing"} className="text-inherit">
    //             <div>Pricing</div>
    //           </Link>
    //           <Link href={"#"} className="text-inherit">
    //             <div>Features</div>
    //           </Link>
    //           <Link href={"#"} className="text-inherit">
    //             <div>Contact Us</div>
    //           </Link>
    //         </div>
    //       </div>
    //     </Col>
    //     <Col span={24} md={8} style={{}}>
    //       <div className="flex flex-col items-center">
    //         <div className="text-[1.5rem] font-medium color-black mb-[3%]">
    //           Utility Page
    //         </div>
    //         <div className="flex flex-col items-center text-center text-[1rem] gap-4 text-[#2E3C51]">
    //           <Link href={"/profile"} className="text-inherit">
    //             <div>My Profile</div>
    //           </Link>
    //           <Link href={"/account"} className="text-inherit">
    //             <div>Account</div>
    //           </Link>
    //           <Link href={"/password-reset"} className="text-inherit">
    //             <div>Reset Password</div>
    //           </Link>
    //         </div>
    //       </div>
    //     </Col>
    //   </Row>
    // </div>
  );
}
