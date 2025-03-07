"use client"
import { Button, Col, Row } from "antd";
import React from "react";
import Image from "next/image";
import EaseOfUseImgUrl from "@Image/EaseOfUseImg.svg";
import { eighthSectionText } from "@/config/LendingPageText";
import { useRouter } from "next/navigation";
export default function EaseOfUse() {
  const router = useRouter();
  return (
    <div className="p-[2%] flex flex-col items-center gap-8">
      <div className="text-[1.5rem] md:text-[2rem] text-[#4B5264] font-[700]">
        {eighthSectionText.title}
      </div>
      <Row justify={"space-around"}>
        <Col span={24} order={2} md={{ span: 12, order: 1 }} style={{}}>
          <div className="text-center flex flex-col items-center">
            <div className="text-[1.8rem] mt-[5%] font-[500]">
              {eighthSectionText.subtitle}
            </div>
            <div className="text-[1rem] mt-[3%] w-[75%] text-[#2A3349]">
              {eighthSectionText.desc}
            </div>
            <Button
              shape="round"
              size="large"
              className="mt-[5%] mb-[5%]"
              style={{ backgroundColor: "black", color: "white" }}
              onClick={()=>router.push("/register")}
            >
              Get Started
            </Button>
          </div>
        </Col>
        <Col span={24} order={1} md={{ span: 12, order: 2 }}>
          <div className="flex items-center justify-center" style={{}}>
            <Image
              src={EaseOfUseImgUrl}
              alt="Image"
              className="w-[90%] md:w-[70%]"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
