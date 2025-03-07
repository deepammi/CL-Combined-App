export const dynamic = "force-dynamic";

import React from "react";
import DuplicateDashboard from "@/components/DuplicateDashboard";
import { getBuyerData } from "@/common/dataService";


export default async function page() {

  const records = await getBuyerData();
  return (
    <>
      <DuplicateDashboard records={records} />
    </>
  );
}
