import ArticleCard from "@/components/ArticleCard/Index";
import { Col, Row } from "antd";
import React from "react";
import IntroCard from "./IntroCard";
import IntroImageUrl1 from "@Image/IntroImg1.svg";
import IntroImageUrl2 from "@Image/IntroImg2.svg";
import IntroImageUrl3 from "@Image/IntroImg3.svg";
import IntroImageUrl4 from "@Image/IntroImg4.svg";
import IntroImageUrl5 from "@Image/IntroImg5.svg";
import { fifthSectionText } from "@/config/LendingPageText";

export default function HowItWork() {
  return (
    <div className="flex flex-col items-center p-[3%] gap-8">
      <div className="text-[1.5rem] md:text-[2rem] font-bold text-[#4B5264]">
        {fifthSectionText.title}
      </div>
      <Row justify={"space-around"} gutter={[16, 32]}>
        <Col span={12} style={{}}>
          <div className="flex items-center justify-center">
            <IntroCard
              ImgUrl={IntroImageUrl1}
              title={"Advanced Audience Targeting"}
              desc={" AI-driven segmentation"}
            />
          </div>
        </Col>
        <Col span={12} className="gutter-row" style={{}}>
          <div className="flex items-center justify-center">
            <IntroCard
              ImgUrl={IntroImageUrl2}
              title="Connect with AI-powered tool"
              desc="See our Sales"
            />
          </div>
        </Col>
        <Col span={12} style={{}}>
          <div className="flex items-center justify-center">
            <IntroCard
              ImgUrl={IntroImageUrl3}
              title="We can build great product together"
              desc="How we engage"
            />
          </div>
        </Col>
        <Col span={12} style={{}}>
          <div className="flex items-center justify-center">
            <IntroCard
              ImgUrl={IntroImageUrl4}
              title="Intelligent Campaign Optimization"
              desc="Our Intelligent Algorithm"
            />
          </div>
        </Col>
        <Col span={12} style={{}}>
          <div className="flex items-center justify-center">
            <IntroCard
              ImgUrl={IntroImageUrl5}
              title="Real-Time Analytics & Insights"
              desc="How we sale our product"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
