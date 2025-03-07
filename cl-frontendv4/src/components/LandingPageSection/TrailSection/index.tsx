import { Button, Card, Col, Row } from "antd";
import Image from "next/image";
import React from "react";
import TrailImgUrl from "@Image/TrailImg.svg";
import { ninthSectionText } from "@/config/LendingPageText";

export default function Trails() {
  return (
    <div className="bg-[url('/Image/TrailBgImgSM.svg')] md:bg-[url('/Image/TrailBgImgMD.svg')] p-[3%]">
      <Row justify={"space-between"} gutter={20}>
        <Col span={24} order={2} md={{ span: 12, order: 1 }}>
          <div className="flex flex-col items-center justify-center text-center mt-[5%] md:mt-[0]">
            <div className="text-[1.6rem] md:text-[2.5rem] font-[700] text-white">
              {ninthSectionText.title}
            </div>
            <div className="mt-[5%] text-white text-[0.8rem] md:text-[1rem] w-[80%]">
              {ninthSectionText.subTitle}
            </div>
            <div className="mt-[5%] flex gap-4">
              <div
                style={{
                  backgroundColor: "#55A1BC",
                  border: "1px solid white",
                  borderRadius: "25px",
                  paddingLeft: "5%",
                }}
              >
                <input
                  placeholder="Enter your Email"
                  className="placeholder-white text-white w-[100%] h-[100%] bg-[transparent] border-none outline-none"
                />
              </div>
              <Button shape="round">Get Started</Button>
            </div>
          </div>
        </Col>
        <Col span={24} order={1} md={{ span: 12, order: 2 }} style={{}}>
          <div className="flex items-center justify-center">
            <Image
              src={TrailImgUrl}
              alt="image"
              className="w-[60%] md:w-[80%]"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
