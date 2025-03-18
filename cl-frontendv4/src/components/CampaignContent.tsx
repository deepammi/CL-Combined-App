import { Button } from "antd";
import FileUploadBox from "./FileUploadBox";
import { useEffect, useState } from "react";
import EmailContainer from "./EmailContainer";
import ResultantQueries from "./ResultantQueries";
import { Spin } from "antd";

interface CampaignContentContainerProps {
  currentTab: string;
  // uploadFileForCampaignSetup: () => void;
}

interface CampaignDetails {
  CampaignDetails?: Record<string, string | number | React.ReactNode>;
  MarketFocus?: {
    Industries: string[];
    Functions: string[];
  };
}

interface AiResearch {
  emailContent: {
    buyer_id: number;
    email1: string;
    email2: string;
    email3: string;
    linkedIn1: string;
    linkedIn2: string;
  }[];
  message?: string;
}

const CampaignContentContainer: React.FC<CampaignContentContainerProps> = ({
  currentTab,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultantCampaignQueries, setResultantCampaignQueries] =
    useState<any>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [campaignDetails, setCampaignDetails] =
    useState<CampaignDetails | null>(null);
  const [aiResearchDetails, setAiResearchDetails] = useState<AiResearch | null>(
    null
  );

  const [buyerQueries, setBuyerQueries] = useState<any>(null);
  const [callerQueries, setCallerQueries] = useState<any>(null);
  const [emailQueries, setEmailQueries] = useState<any>(null);
  const [dbCommitResponse, setDbCommitResponse] = useState<string>("");

  const uploadFileForCampaignSetup = async () => {
    setIsLoading(true);
    console.log("[SELECTED FILE]:", selectedFile);
    if (!selectedFile) {
      console.error("No file selected for upload!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/campaign/campaign-setup`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Data:", data);
      if (data?.statusCode === 200) {
        setCampaignDetails(data?.data);
        setResultantCampaignQueries(data?.resultantQueries);
        console.log("[campaignDetails]:", campaignDetails);
      }
      return;
    } catch (err) {
      console.log("[ERROR]:", err);
      return;
    } finally {
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    console.log("[BUYER]:", buyerQueries);
    console.log("[CALLER SCRIPT]:", callerQueries);
    console.log("[EMAIL SCRIPT]:", emailQueries);
  }, [buyerQueries, callerQueries, emailQueries]);

  const uploadFileForAiResearch = async () => {
    console.log("[SELECTED RESEARCH FILE]:", selectedFile);
    if (!selectedFile) {
      console.error("No file selected for upload!");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/campaign/ai-research`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Data:", data);
      if (data?.statusCode === 200) {
        const tablesData = data?.dataInsertedToTables;

        if (tablesData && tablesData.length > 0) {
          const { buyer, callScripts, emailScript } = tablesData[0];

          console.log("Buyer Data:", buyer);
          console.log("Call Scripts:", callScripts);
          console.log("Email Script:", emailScript);

          setBuyerQueries(buyer ?? {});
          setCallerQueries(callScripts ?? []);
          setEmailQueries(emailScript ?? {});
        }
        setAiResearchDetails(data?.data);
      }
    } catch (err) {
      console.log("[ERROR]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitToDb = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/campaign/commit-to-db`,
        {
          method: "POST",
          // body: formData
        }
      );
      const data = await response.json();
      console.log("[MESSAGE]:", data);
      setDbCommitResponse(data?.message);
    } catch (err) {
      console.log("[ERROR WHILE ATTEMPTING TO COMMIT THE TABLES TO DB]:", err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("[uploaded file]:", selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    console.log("AI RESEARCH RESULTS:", aiResearchDetails);
  }, [aiResearchDetails]);

  return (
    <div className="w-[80%] h-[100%] flex flex-col gap-3 justify-center items-center ">
      {currentTab === "CAMPAIGN_SETUP" && (
        <>
          <FileUploadBox
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            onFileUpload={() => { }}
          />
          <Button className="my-2" onClick={uploadFileForCampaignSetup}>
            {isLoading ? <Spin size="small" /> : "Submit"}
          </Button>

          {campaignDetails?.CampaignDetails && (
            <div className="min-w-[80%]">
              <h2 className="text-lg font-bold mb-4">Campaign Details</h2>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Key</th>
                    <th className="border border-gray-300 px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(campaignDetails.CampaignDetails).map(
                    ([key, value]) => (
                      <tr key={key}>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {key}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {campaignDetails?.MarketFocus && (
            <div className="min-w-[80%]">
              <h2 className="text-lg font-bold mb-4">Market Focus</h2>
              <div>
                <div className="space-y-4 ">
                  {/* <h3 className="text-md font-semibold mb-2">Industries</h3> */}
                  <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">
                          Industry
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Function
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.from({
                        length: Math.max(
                          campaignDetails.MarketFocus.Industries.length,
                          campaignDetails.MarketFocus.Functions.length
                        ),
                      }).map((_, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">
                            {campaignDetails?.MarketFocus?.Industries[index] ||
                              "-"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {campaignDetails?.MarketFocus?.Functions[index] ||
                              "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <ResultantQueries
            isLoading={isLoading}
            queries={resultantCampaignQueries}
          />
        </>
      )}
      {currentTab === "AI_RESEARCH" && (
        <>
          <Button className="my-2" onClick={uploadFileForAiResearch}>
            {isLoading ? <Spin size="small" /> : "Submit"}
          </Button>

          {aiResearchDetails?.emailContent ? (
            <>
              <h2 className="text-lg font-bold mb-4">Email1</h2>
              <EmailContainer
                email={aiResearchDetails?.emailContent[0]?.email1}
              />

              <h2 className="text-lg font-bold mb-4">Email2</h2>
              <EmailContainer
                email={aiResearchDetails?.emailContent[0]?.email2}
              />

              <h2 className="text-lg font-bold mb-4">Email3</h2>
              <EmailContainer
                email={aiResearchDetails?.emailContent[0]?.email3}
              />

              <h2 className="text-lg font-bold mb-4">LinkedIn1</h2>
              <EmailContainer
                email={aiResearchDetails?.emailContent[0]?.linkedIn1}
              />

              <h2 className="text-lg font-bold mb-4">LinkedIn2</h2>
              <EmailContainer
                email={aiResearchDetails?.emailContent[0]?.linkedIn2}
              />
            </>
          ) : (
            <p className="text-gray-500 mt-4">
              No email generated yet. Upload a file to generate an email.
            </p>
          )}

          {buyerQueries && (
            <div className="w-[80%]">
              <h2 className="text-lg font-bold mb-4">Buyer Information</h2>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <tbody>
                  {Object.entries(buyerQueries).map(([key, value]) => (
                    <tr key={key}>
                      <th className="border border-gray-300 px-4 py-2 ">
                        {key}
                      </th>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {callerQueries?.length > 0 && (
            <div className="w-[80%]">
              <h2 className="text-lg font-bold mb-4">Call Scripts</h2>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      Buyer ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Product ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Topic ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {callerQueries.map((query: any, index: any) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {query.buyerId}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {query.productId}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {query.topicId}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {query.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {emailQueries?.email1 && (
            <div className="w-[80%] flex flex-col items-center mt-[2rem]">
              <h2 className="text-lg font-bold mb-4">Email Content</h2>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      buyerId
                    </th>
                    <th className="border border-gray-300 px-4 py-2">email1</th>
                    <th className="border border-gray-300 px-4 py-2">email2</th>
                    <th className="border border-gray-300 px-4 py-2">email3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      {emailQueries.buyerId}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {emailQueries.email1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {emailQueries.email2}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {emailQueries.email3}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {currentTab === "COMMIT_TO_DB" && (
        <>
          <div className="h-[70vh] w-full flex flex-col justify-center items-center">
            <Button className="my-2" onClick={handleCommitToDb}>
              {isLoading ? <Spin size="small" /> : "COMMIT TO DB"}
            </Button>

            <p className="mt-[2rem]">{dbCommitResponse}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignContentContainer;
