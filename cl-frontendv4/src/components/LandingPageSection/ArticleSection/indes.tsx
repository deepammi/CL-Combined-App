import React from "react";
import { Button, Col, Row } from "antd";
import ArticleCard from "@/components/ArticleCard/Index";
import ArticleImgUrl1 from "@Image/ArticleImage1.svg";
import ArticleImgUrl2 from "@Image/ArticleImage2.svg";
import ArticleImgUrl3 from "@Image/ArticleImage3.svg";
import { fourthSectionText } from "@/config/LendingPageText";

export default function ArticleSection() {
  return (
    <div className="flex flex-col items-center gap-8 pl-[10%] pl-[10%] pt-[5%] pb-[5%]">
      <div className="text-[1.8rem] md:text-[2.5rem] font-bold text-[#4B5264]">
        {fourthSectionText.title}
      </div>
      <div className="flex justify-between gap-2 md:gap-4">
        <Button className="!bg-[#737EEF] !text-[white] !text-[0.5rem] md:!text-[0.9rem]">{fourthSectionText.button1Text}</Button>
        <Button className="!text-[0.5rem] md:!text-[0.9rem]">{fourthSectionText.button2Text}</Button>
        <Button className="!text-[0.5rem] md:!text-[0.9rem]">{fourthSectionText.button3Text}</Button>
      </div>
      <Row justify={"space-around"} gutter={[32, 32]}>
        <Col span={24} md={8} style={{}}>
          <ArticleCard
            imgUrl={ArticleImgUrl1}
            dateSting="November 15, 2022"
            title="10 Top tips for making your Saas product sticky"
            desc="Conduct regular user research to stay aligned with their evolving requirements.Ensure a smooth and intuitive onboarding process to engage users from the start. Regularly update features and provide meaningful benefits that solve real problems."
          />
        </Col>
        <Col span={24} md={8} style={{}}>
          <ArticleCard
            imgUrl={ArticleImgUrl2}
            dateSting="November 15, 2022"
            title="Automate Reports Generation with Saasup"
            desc="Effortlessly automate your report generation process with Saasup. Save time and reduce errors by leveraging our powerful tools to create accurate and timely reports. With customizable templates and real-time data integration, Saasup enhances productivity"
          />
        </Col>
        <Col span={24} md={8} style={{}}>
          <ArticleCard
            imgUrl={ArticleImgUrl3}
            dateSting="November 15, 2022"
            title="10 Top tips for making your Saas product sticky"
            desc="Conduct regular user research to stay aligned with their evolving requirements.Ensure a smooth and intuitive onboarding process to engage users from the start. Regularly update features and provide meaningful benefits that solve real problems."
          />
        </Col>
      </Row>
    </div>
  );
}
