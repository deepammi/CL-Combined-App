"use client"

import CampaignContentContainer from "@/components/CampaignContent";
import SideNavbar from "@/components/SideNavbar";
import { useState } from "react";

export default function AiResearchPage() {

  const [currentTab, setCurrentTab] = useState<string>('CAMPAIGN_SETUP');

  const handleCurrentTab = (value:string) => {
    setCurrentTab(value);
  }

  return (
    <div className="mt-24 flex flex-col items-center gap-4 h-auto">
      <div className="w-full h-[100%] flex flex-row">
        <SideNavbar onToggleTab={handleCurrentTab} />
        <CampaignContentContainer currentTab={currentTab} />
      </div>
    </div>
  );
}