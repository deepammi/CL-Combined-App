"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Modal, Table, Spin, message } from "antd";
import { thirdSectionText } from "@/config/CallerDahsboardPageText";
import AudioPlayer from "./AudioPlayer";
import axios from "axios";

export default function CallLogs({
  datatableUsers = [],
  parentTran = "",
  modShow = true,
  buyer_identifier = null,
}) {
  const [showPortal, setShowPortal] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [size, setSize] = useState(perPage);
  const [current, setCurrent] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [currentEntries, setCurrentEntries] = useState(
    datatableUsers.length ? datatableUsers : []
  );
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRecordings, setFetchingRecordings] = useState(false);
  const [fetchingTranscripts, setFetchingTranscripts] = useState(false);
  const [error, setError] = useState(null);

  const PerPageChange = (value) => {
    setSize(value);
    const newPerPage = Math.ceil(datatableUsers.length / value);
    if (current > newPerPage) {
      setCurrent(newPerPage);
    }
  };

  const PaginationChange = (page, pageSize) => {
    setCurrent(page);
    setSize(pageSize);
  };

  const PrevNextArrow = (current, type, originalElement) => {
    if (type === "prev")
      return (
        <button>
          <i className="fa fa-angle-double-left"></i>
        </button>
      );
    if (type === "next")
      return (
        <button>
          <i className="fa fa-angle-double-right"></i>
        </button>
      );
    return originalElement;
  };

  // Retry mechanism for API calls
  const retryApiCall = async (apiCall, maxRetries = 3) => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await apiCall();
      } catch (error) {
        retries++;
        console.error(`API call failed (attempt ${retries}/${maxRetries}):`, error);
        
        if (retries >= maxRetries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
      }
    }
  };

  const fetchRecordings = async () => {
    setFetchingRecordings(true);
    setError(null);
    
    try {
      const res = await retryApiCall(() => 
        axios.post(
          `${process.env.NEXT_PUBLIC_API_BASEURL}/fetch-data-type`,
          { mode: "recording" },
          { timeout: 30000 } // Increase timeout for this operation
        )
      );
      
      if (res.status === 200) {
        message.success("Recordings fetched successfully");
        console.log("[RESPONSE]:", res);
      }
      setRefresh(prev => !prev); // Toggle refresh to trigger data reload
    } catch (e) {
      console.error("Error fetching recordings:", e);
      setError("Failed to fetch recordings. Please try again.");
      message.error("Failed to fetch recordings. Please try again.");
    } finally {
      setFetchingRecordings(false);
    }
  };

  const openTranscript = (data) => {
    if (data.transcript) {
      try {
        parentTran(JSON.parse(data.transcript));
      } catch (error) {
        console.error("Error parsing transcript:", error);
        parentTran([]);
        message.error("Error parsing transcript data");
      }
    } else {
      parentTran([]);
    }
    modShow(true);
  };

  const fetchTranscript = async () => {
    setFetchingTranscripts(true);
    setError(null);
    
    try {
      const response = await retryApiCall(() => 
        axios.post(
          `${process.env.NEXT_PUBLIC_API_BASEURL}/fetch-data-type`,
          { mode: "transcript" },
          { timeout: 30000 } // Increase timeout for this operation
        )
      );
      
      if (response.status === 200) {
        message.success("Transcripts fetched successfully");
        console.log("[RESPONSE FROM TRANSCRIPT FETCH]:", response);
      }
      setRefresh(prev => !prev); // Toggle refresh to trigger data reload
    } catch (error) {
      console.error("Error fetching transcripts:", error);
      setError("Failed to fetch transcripts. Please try again.");
      message.error("Failed to fetch transcripts. Please try again.");
    } finally {
      setFetchingTranscripts(false);
    }
  };

  useEffect(() => {
    const getCallLogs = async () => {
      if (!buyer_identifier) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const newCallLogs = await retryApiCall(() => 
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASEURL}/get-call-logs?page=${current}&limit=${perPage}&buyer_id=${buyer_identifier}`,
            { timeout: 10000 }
          )
        );
        console.log("[NEW CALL LOGS]:", newCallLogs);
        setCurrentEntries(newCallLogs.data.retrievedRows || []);
      } catch (error) {
        console.error("Error fetching call logs:", error);
        setError("Failed to load call logs. Please try again.");
        message.error("Failed to load call logs");
      } finally {
        setLoading(false);
      }
    };

    getCallLogs();
  }, [current, perPage, refresh, buyer_identifier]);

  const columns = [
    {
      title: <div className="text-center">Date</div>,
      dataIndex: "call_date",
      key: "call_date",
      width: "10%",
      align: "center",
      className: "text-center",
      render: (_date) => {
        const date = _date
          ? new Date(_date).toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "2-digit",
            })
          : "N/A";
        return <div>{date}</div>;
      },
    },
    {
      title: <div className="text-center">Summary</div>,
      dataIndex: "summary",
      key: "summary",
      width: "40%",
      className: "text-center",
      render: (summary) => {
        return <div>{summary ?? "N/A"}</div>;
      },
    },
    {
      title: <div className="text-center">Call Recording</div>,
      dataIndex: "call_recording",
      key: "call_recording",
      render: (text) => (
        <AudioPlayer className="m-auto" key={text} signedUrl={text} />
      ),
      width: "35%",
      className: "m-auto text-center flex justify-center",
    },
    {
      title: <div className="text-center">Transcript</div>,
      dataIndex: "transcript",
      key: "transcript",
      className: "text-center",
      render: (transcript) => (
        <Button
          onClick={() => {
            if (transcript) {
              try {
                setTranscript(JSON.parse(transcript));
              } catch (error) {
                console.error("Error parsing transcript:", error);
                setTranscript([]);
                message.error("Error parsing transcript data");
              }
            } else {
              setTranscript([]);
            }
            setShowTranscriptModal(true);
          }}
          type="primary"
          shape="round"
        >
          view
        </Button>
      ),
      width: "15%",
      align: "center",
    },
  ];

  return (
    <div className="w-[100%]">
      <Modal
        centered={true}
        title={"Transcript"}
        open={showTranscriptModal}
        onCancel={() => {
          setShowTranscriptModal(false);
        }}
        footer={null}
      >
        <div className="max-h-40 overflow-y-auto">
          {transcript.length ? (
            transcript.map((dat, id) => {
              return (
                <p key={id}>
                  Participant: {dat.participant || dat.speaker || "Unknown"} - {dat.content || dat.text || ""}
                </p>
              );
            })
          ) : (
            <p>No transcript available</p>
          )}
        </div>
      </Modal>
      
      <div className="w-[100%] flex flex-col gap-8 items-center mt-[3%]">
        <div className="text-2xl md:text-3xl font-semibold">
          {thirdSectionText.title}
        </div>
        
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ width: '80%', maxWidth: '800px' }}
          />
        )}
        
        <div className="flex gap-4 md:gap-10">
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={fetchRecordings}
            loading={fetchingRecordings}
            disabled={fetchingRecordings || fetchingTranscripts}
          >
            {fetchingRecordings ? "Fetching..." : thirdSectionText.button1Text}
          </Button>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={fetchTranscript}
            loading={fetchingTranscripts}
            disabled={fetchingRecordings || fetchingTranscripts}
          >
            {fetchingTranscripts ? "Fetching..." : thirdSectionText.button2Text}
          </Button>
        </div>
        
        <div className="px-[5%] md:px-[10%] w-[100%]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" tip="Loading call logs..." />
            </div>
          ) : (
            <Table
              dataSource={currentEntries}
              columns={columns}
              bordered
              pagination={true}
              style={{ backgroundColor: "inherit", tableLayout: "fixed" }}
              locale={{ emptyText: "No call logs found" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
