import React from "react";
import DataTable from "./DataTable";

const ResultantQueries = ({ queries, isLoading }: { queries: any, isLoading: Boolean },) => {
  return (
    <>
      {/* {isLoading ? ( */}
        <>
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Resultant Queries</h1>

            <DataTable heading="Campaigns Temp" data={[queries?.campaigns_temp]} vertical={true} />

            <DataTable
              heading="Users Temp"
              data={queries?.users_temp?.map((user: any) => ({
                ...user,
                password_hint: user.password_hint || "N/A", // Handle nullable fields
              }))}
              vertical={false}
            />

            <DataTable
              heading="Camp Users Temp"
              data={queries?.campaign_user_temp?.map((user: any) => ({
                ...user,
              }))}
              vertical={false}
            />

            <DataTable
              heading="Topics Temp"
              data={queries?.topics_temp?.map((topic: any) => ({
                ...topic,
              }))}
              vertical={false}
            />
          </div>

        </>
      {/* ) : (
        <></>
      )} */}
    </>
  );
};

export default ResultantQueries;  
