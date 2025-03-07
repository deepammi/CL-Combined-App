import { useState } from "react";
import { Button } from "antd";
import LikeOutlineIcon from "./LikeOutlineIcon";
import DislikeOutlinedIcon from "./DislikeOutlinedIcon";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CallScript = ({ call_script }: any) => {
  const [comment, setComment] = useState("");
  const [vote, setVote] = useState<null | Boolean>(null);

  const submitComment = async () => {
    if (!comment && vote === null) return;

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASEURL}/feedback`;
      let result = await axios.post(endpoint, {
        call_script_id: call_script.body.id,
        topic_id: call_script.body.Topics.id,
        section_title: call_script.body.Topics.title,
        user_email: (
          jwtDecode(localStorage.getItem("accessToken") ?? "") as any
        ).email,
        comment: comment,
        flag: vote,
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" flex flex-col gap-4 items-center w-[100%]">
      <div className="text-sm md:text-base max-h-24 overflow-y-auto">
        {call_script.body?.description}
      </div>
      <div className="flex items-center justify-between w-[90%] md:w-[80%]  align-center">
        <div className="flex gap-4 md:gap-6">
          <LikeOutlineIcon vote={vote} setVote={setVote} />
          <DislikeOutlinedIcon vote={vote} setVote={setVote} />
        </div>
        <div className="w-[40%] md:w-[50%]">
          <input
            placeholder="Comments"
            className="border-2 border-[#000000] rounded-full pl-3 w-[100%] pt-1 pb-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <Button
          type="primary"
          shape="round"
          className="text-base md:text-lg lg:text-xl px-4 md:px-6 lg:px-8"
          onClick={submitComment}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CallScript;
