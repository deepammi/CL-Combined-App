import { Button, Card, Col, Divider, Row } from "antd";
import React from "react";
import TickIconBlueBgUrl from "@Image/TickIconBlueBG.svg";
import TickIconWhiteBgUrl from "@Image/TickIconWhiteBG.svg";
import Image from "next/image";
import { sixthSectionText } from "@/config/LendingPageText";

export default function Plans() {
  return (
    <div className="m-[1%] sm:m-[2%] md:m-[4%] lg:m-[5%] flex flex-col items-center justify-center gap-10">
      <div className="text-[1.5rem] md:text-[2rem] font-bold text-[#4B5264]">
        {sixthSectionText.title}
      </div>
      <Row
        gutter={{ xs: 4, sm: 8, md: 16, lg: 32, xl: 64 }}
        justify={"space-around"}
      >
        <Col span={8} style={{ height: "20rem" }}>
          <Card className="shadow rounded-lg" style={{ width: "100%" }}>
            <div className="flex justify-between">
              <div className="font-[700] text-[1rem]">Intro</div>
              <div className="text-[#2A3349] text-[0.8rem]">{sixthSectionText.introFeature}</div>
            </div>
            <div className="mt-[0.5rem] text-[#2A3349]">
              <span className="font-[800] text-[black]">{sixthSectionText.introPrice}</span>/month
            </div>
            <Divider style={{ backgroundColor: "#C8C7C7" }}/>
            <div className="text-center font-medium">
              Simple and flexible pricing
            </div>
            <div className="flex items-center justify-center mt-[3%]">
              <div className="flex flex-col justify-center gap-6 w-[100%] md:w-[80%] lg">
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Simple, transparent pricing.</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Guaranteed 100X Return on Investment.</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Accepted Payment Methods</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-[25%] mb-[8%]">
              <Button type="primary" shape="round" style={{ padding: "0 20%" }}>
                Get Started
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={8} style={{}}>
          <Card
            className="shadow rounded-lg "
            style={{ width: "100%", backgroundColor: "#0961E3" }}
          >
            <div className="flex justify-between text-white">
              <div className="font-[700] text-[1rem]">Basic</div>
              <div className="text-[#fff] text-[0.8rem]">{sixthSectionText.baseFeature}</div>
            </div>
            <div className="mt-[0.5rem] text-[#fff]">
              <span className="font-[800] text-[white]">{sixthSectionText.basicPrice}</span>/month
            </div>
            <Divider style={{ backgroundColor: "#fff" }} />
            <div className="flex flex-col gap-3 items-center">
              <div className="text-[#fff] font-medium">Call for pricing</div>
              <Button
                shape="round"
                size="small"
                className="text-[#fff]"
                style={{ backgroundColor: "#99ccff " }}
              >
                Billed per campaign
              </Button>
            </div>
            <Divider style={{ backgroundColor: "#fff" }} />
            <div className="flex items-center justify-center mt-[3%]">
              <div className="flex flex-col justify-center gap-4 w-[100%] md:w-[80%] text-[#fff]">
                <div className="flex gap-2 items-center">
                  <Image src={TickIconWhiteBgUrl} alt="tick" width={20} />
                  <div>Unlimited members</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconWhiteBgUrl} alt="tick" width={20} />
                  <div>Unlimited Feedback</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconWhiteBgUrl} alt="tick" width={20} />
                  <div>Optimize Hashtag</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconWhiteBgUrl} alt="tick" width={20} />
                  <div>Caller Feedback</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-[15%] mb-[10%]">
              <Button type="default" shape="round" style={{ padding: "0 20%" }}>
                Get Started
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={8} style={{}}>
          <Card
            className="shadow rounded-lg "
            style={{ width: "100%", backgroundColor: "#fff" }}
          >
            <div className="flex justify-between">
              <div className="font-[700] text-[1rem]">Advance</div>
              <div className="text-[#8BB1EE] text-[0.8rem]">{sixthSectionText.advanceFeature}</div>
            </div>
            <div className="mt-[0.5rem] text-[#000]">
              <span className="font-[800] text-[black]">{sixthSectionText.advancePrice}</span>/month
            </div>
            <Divider style={{ backgroundColor: "#C8C7C7" }}/>
            <div className="flex flex-col gap-3 items-center">
              <div className="text-[#000] font-medium">Call for pricing</div>
              <Button
                shape="round"
                size="small"
                className="text-[#fff]"
                style={{ backgroundColor: "#99ccff " }}
              >
                Billed per campaign
              </Button>
            </div>
            <Divider style={{ backgroundColor: "#C8C7C7" }} />
            <div className="flex items-center justify-center mt-[3%]">
              <div className="flex flex-col justify-center gap-4 w-[100%] md:w-[80%]">
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Unlimited members</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Unlimited Feedback</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Optimize Hashtag</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Image src={TickIconBlueBgUrl} alt="tick" width={20} />
                  <div>Caller Feedback</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-[15%] mb-[10%]">
              <Button type="primary" shape="round" style={{ padding: "0 20%" }}>
                Get Started
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
