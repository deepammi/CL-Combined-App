import { Card } from "antd";
import Image from "next/image";
import React from "react";
import Link from "next/link";
export default function ArticleCard({
  imgUrl,
  dateSting,
  title,
  desc,
}: {
  imgUrl: string;
  dateSting: string;
  title: string;
  desc: string;
}) {
  return (
    <Card className="w-[100%] h-[33rem] p-[0.5%]">
      <div>
        <Image src={imgUrl} alt="img" className="w-[100%]" />
      </div>
      <div className="text-[#2A3349] mt-[2%]">{dateSting}</div>
      <div className="text-[#000] text-center mt-[3%] font-medium text-[1.5rem]">{title}</div>
      <div className="text-[#2A3349] mt-[3%]">{desc}</div>
      <div className="text-center mt-[2%]">
        <Link href={"#"}>Read More</Link>
      </div>
    </Card>
  );
}
