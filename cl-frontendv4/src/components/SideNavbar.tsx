import { useState } from "react";
interface CampaignContentContainerProps {
    onToggleTab: (value: string) => void;
}



const SideNavbar: React.FC<CampaignContentContainerProps> = ({ onToggleTab }) => {

    return (
        <>
            <div className="w-[20%] h-[100%] border-r-2 ">
                <div onClick={() => onToggleTab('CAMPAIGN_SETUP')} className="w-[100%] border-y-2 p-3 flex justify-center text-blue-500">
                    <p className=" text-blue-500 p-0 m-0 uppercase font-semibold cursor-pointer">
                        Campaign Setup
                    </p>
                </div>
                <div onClick={() => onToggleTab('AI_RESEARCH')} className="w-[100%] border-y-2 p-3 flex justify-center text-blue-500">
                    <p className=" text-blue-500 p-0 m-0 uppercase font-semibold cursor-pointer">
                        AI Research
                    </p>
                </div>
                <div onClick={() => onToggleTab('COMMIT_TO_DB')} className="w-[100%] border-y-2 p-3 flex justify-center text-blue-500">
                    <p className=" text-blue-500 p-0 m-0 uppercase font-semibold cursor-pointer">
                        Commit to db
                    </p>
                </div>
            </div>
        </>
    )
}

export default SideNavbar;