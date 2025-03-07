import { secondSectionText } from "@/config/LendingPageText";
import { Button, Card, Col } from "antd";
import Image from "next/image";
import React from "react";

export default function index({
  ImgUrl,
  Title,
  Description,
}: {
  ImgUrl: string;
  Title: string;
  Description: string;
}) {
  return (
    <Col xs={24} md={8}>
      <Card
        hoverable
        className="h-[28rem] rounded-[4px] bg-white flex-shrink-0 shadow-[10px_10px_20px_0px_rgba(0,0,0,0.25),_-10px_-10px_20px_0px_rgba(147,147,147,0.25)_inset]"
      >
        <div className="flex flex-col justify-between h-[25rem]">
          <div className="flex justify-center h-[40%]">
            <Image alt="example" src={ImgUrl} className="w-1/2 aspect-[1/1]" />
          </div>
          <div>
            <div className="text-[1rem] text-center font-bold mb-2">
              {Title}
            </div>
            <div className="text-[1rem]">{Description}</div>
          </div>
          <div className="flex justify-center">
            <Button shape="round" type="primary" className="mt-4">
              {secondSectionText.moreButton}
            </Button>
          </div>
        </div>
      </Card>
    </Col>
  );
}
