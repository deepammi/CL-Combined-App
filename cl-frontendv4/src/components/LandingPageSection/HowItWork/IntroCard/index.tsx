"use client";
import { Card } from "antd";
import React from "react";
const { Meta } = Card;
import ArrowIconUrl from "@Image/ArrowIcon.svg";

import Link from "next/link";
import Image from "next/image";
export default function IntroCard({
  ImgUrl,
  title,
  desc,
}: {
  ImgUrl: string;
  title: string;
  desc: string;
}) {
  return (
    <Card
      hoverable
      className="w-[90%] md:w-[70%]"
      cover={<Image alt="img" src={ImgUrl} />}
    >
      <div className="flex flex-col items-center text-[#2A3349]">
        <div className="font-bold">{title}</div>
        <div className="flex gap-2">
          <div className="font-medium">{desc}</div>
          <Image src={ArrowIconUrl} alt="arrow" width={20} />
        </div>
      </div>
    </Card>
  );
}
