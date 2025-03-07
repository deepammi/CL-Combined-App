import { Button, Card } from "antd";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import QuoteIconUrl from "@Image/QuoteIcon.svg";
import PlayIconUrl from "@Image/PlayIconBlack.svg";
export default function TestimonialCard({
  imgUrl,
  quote,
  name = "",
  companyName = "",
}: {
  imgUrl: string;
  quote: string;
  name: string;
  companyName: string;
}) {
  return (
    <div>
      <Card style={{ padding: "0.5%", position: "relative" }}>
        <div style={{ position: "absolute", top: "-2rem", left: "1.5rem" }}>
          <Image src={imgUrl} alt="img" style={{ width: "50%" }} />
        </div>
        <div style={{ position: "absolute", top: "-1.4rem", right: "-5%" }}>
          <Image src={QuoteIconUrl} alt="img" style={{ width: "60%" }} />
        </div>
        <div className="mt-[5%]">{quote}</div>
        <hr className="h-[0.15rem] bg-[#DBDBDB] mt-[3%] mb-[2%]" />
        <div className="w-[100%] flex justify-between items-center">
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-[0.8rem]">{companyName}</div>
          </div>
          <Button
            shape="round"
            icon={
              <Image src={PlayIconUrl} alt="play" style={{ width: "0.6rem" }} />
            }
            iconPosition="end"
          >
            Play
          </Button>
        </div>
      </Card>
    </div>
  );
}
