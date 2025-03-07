import {Col, Row } from "antd";
import React from "react";
import TestimonialCard from "./TestimonialCard";
import TestimonialImg1 from "@Image/TestmonialImg1.svg";
import TestimonialImg2 from "@Image/TestmonialImg2.svg";
import TestimonialImg3 from "@Image/TestmonialImg3.svg";
import { seventhSectionText } from "@/config/LendingPageText";

export default function Testimonials() {
  return (
    <div className="m-[5%] flex flex-col items-center">
      <div className="text-[1.5rem] md:text-[2rem] font-[600] text-[#4B5264]">
        {seventhSectionText.title}
      </div>
      <div className="text-[0.7rem] md:text-[1rem] text-[#2A3349] mt-[2%]">
        Their <span className="font-medium">Sweet Words</span> for our sincere
        work
      </div>
      <Row
        gutter={[32, 64]}
        justify={"space-around"}
        align={"middle"}
        className="mt-[7%]"
      >
        <Col span={12} md={8}>
          <TestimonialCard
            imgUrl={TestimonialImg1}
            quote={
              "The pre-sales team is dynamic and always focused on delivering top-notch solutions to clients. I’m proud to be part of such a forward-thinking company!"
            }
            name="Heidi haynes"
            companyName="PreSale employee"
          />
        </Col>
        <Col span={12} md={8} style={{}}>
          <TestimonialCard
            imgUrl={TestimonialImg2}
            quote={
              "Outbound PreSales calling used to be a hated task with a lot of manual preparation, frustrating workflows and slow results. TBI Corp has waved a magic wand for us. The power of generative AI is unbelievable"
            }
            name="James Toriff"
            companyName="PreSales Head"
          />
        </Col>
        <Col span={12} md={8} style={{}}>
          <TestimonialCard
            imgUrl={TestimonialImg3}
            quote={
              " The pre-sales team is dynamic and always focused on delivering top-notch solutions to clients. I’m proud to be part of such a forward-thinking company!"
            }
            name="Naman Sarawagi"
            companyName="PreSale Employe"
          />
        </Col>
      </Row>
    </div>
  );
}
