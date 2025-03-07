import { useEffect, useState } from "react";
import { Button } from "antd";
import LikeOutlineIcon from "./LikeOutlineIcon";
import DislikeOutlinedIcon from "./DislikeOutlinedIcon";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TickIconUrl from "@Image/TickIconBlueBG.svg";
import TickIconWhiteBG from "@Image/TickIconWhiteBG.svg";
import Image from "next/image";
import Markdown from "react-markdown";
import { Spin } from "antd";
import { FaNotesMedical } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";

interface CallScriptItem {
    uuid: string;
    category: string;
    title: string;
    body: any;
}

const EmailGuide = ({ email_guide_text, call_script }: any) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [cumulativeBody, setCumulativeBody] = useState<string>(
        "You are a caller’s assistant. You have to create a short Calling Script for calling a customer using the following Context"
    );
    const [isSubmitted, setIsSubmitted] = useState<Boolean>(false);
    const [receivedResponse, setReceivedResponse] = useState<any>(null);
    const [responseError, setResponseError] = useState<Boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const handleAddOrRemoveItemInCheckList = (title: string): void => {
        setCheckedItems(prevCheckedItems => {
            if (prevCheckedItems.includes(title)) {
                return prevCheckedItems.filter(item => item !== title);
            } else {
                return [...prevCheckedItems, title];
            }
        });
    };

    const getConcatenatedBody = () => {
        const checkedBodies = call_script
            .filter((item: CallScriptItem) => checkedItems.includes(item.title))
            .map((item: CallScriptItem) => item?.body?.description);

        const mergedString = "You are a digital marketing assistant. You have to create an Email of less than 300 words, for starting a conversation with a new customer using the following Context. The language should be business-level professional.\n\n" + checkedBodies.join("\n\n");
        setCumulativeBody(mergedString);
    };

    async function handleSubmit() {
        try {
            setIsLoading(true);
            const payload = {
                context: cumulativeBody
            }
            setIsSubmitted(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/guide/email-guide`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            const data = await response.json();
            console.log("[RECIEVED DATA FROM SERVER SIDE]:", data);
            if (data?.statusCode === 500) {
                setIsLoading(false);
                setResponseError(true);
                setErrorMessage(data?.message);

                return;
            } else if (data?.statusCode === 200) {
                setIsLoading(false);
                setReceivedResponse(data?.data);
                console.log("[RECEIVED RESPONSE]:", receivedResponse);
            }

        } catch (err) {
            console.log("[SOME EXCEPTION HAS OCCURED]:", err);
            setIsLoading(false);
            return;
        }
    }

    useEffect(() => {
        getConcatenatedBody();
    }, [checkedItems]);

    return (
        <div className=" flex flex-col gap-4 items-center w-[100%] mt-10">
            <div className="text-2xl md:text-3xl font-semibold">
                {email_guide_text.title}
            </div>

            <div className="flex items-center gap-2 text-gray-700 text-sm">
                <FaExclamationCircle className="text-blue-500" size={20} />  {/* Note Icon */}
                <span>Tap on any of these checkboxes of your choice to create yourself an email guide.</span>
            </div>

            <div className="flex flex-wrap gap-4 w-[90%] justify-center">
            {call_script.map((check: CallScriptItem) => {
                    const isChecked = checkedItems.includes(check.title);
                    return (
                        <div
                            key={check.uuid}
                            onClick={() => { handleAddOrRemoveItemInCheckList(check?.title) }}
                            className={`flex border-2 border-neutral-200 h-10 items-center justify-center gap-2 cursor-pointer rounded-full px-2 py-1 hover:bg-blue-600 overflow-hidden hover:text-white transition-all duration-500 w-7 sm:w-[calc(33.33%-1rem)] md:w-[calc(25%-1rem)] ${isChecked ? "bg-slate-200 rounded-full" : ""}`}
                        >
                            {isChecked && (
                                <>
                                    <div className="w-[2rem] border-2 rounded-full">
                                        <Image src={TickIconUrl} alt="tick" />
                                    </div>
                                </>
                            )}
                            <div>{check.title}</div>
                        </div>
                    );
                })}
            </div>

            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 rounded-lg font-semibold text-white uppercase tracking-wider hover:bg-blue-800 ">
                {isLoading ? <Spin size="small" /> : 'Submit'}
            </button>

            {responseError ? (
                <>
                    <p className="text-red-600">
                        {errorMessage}
                    </p>
                </>
            ) : (
                <></>
            )}

            
{receivedResponse ? (
                 <>
                 <div className="w-[80%] h-auto border-2 rounded shadow-md p-5">
                     <p>
                         <Markdown>{receivedResponse}</Markdown>
                     </p>
                 </div>
             </>
            ): (
                <div className="w-[80%] h-auto border-2 rounded shadow-md p-5">
                     <p>
                        AI generated email guidance/assistance will appear here.
                     </p>
                 </div>
            )}
        </div>
    );
};

export default EmailGuide;
