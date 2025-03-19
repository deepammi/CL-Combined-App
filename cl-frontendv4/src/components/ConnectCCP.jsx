// Copyright Amazon.com, Incon. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Button } from "antd";
import React, { memo, useRef, useState, useEffect } from "react";
import axios from "axios";
import CallButton from "./phone/CallButton";
import HangUpButton from "./phone/HangUpButton";
import CallInputs from "./CallInputs";
import Image from "next/image";
import CutCallIcon from "./CutCallIcon";
import DialCallIcon from "./DialCallIcon";

const ConnectCCP = ({ phoneNum, buyer_Identifier }) => {
  const ref = useRef();
  const [contactId, setContactId] = useState("");
  const [sourcePhone, setSourcePhone] = useState(
    "1" + phoneNum?.replace(/\D/g, "")
  );
  const [destPhone, setDestPhone] = useState("1" + phoneNum?.replace(/-/g, ""));
  const [contactFlowId, setContactFlowId] = useState(
    "b7f26976-0dc7-4391-b43d-bf6ea1b19e91"
  );
  const [instanceId, setConnectInstanceId] = useState(
    "695227e1-08a7-41ff-b42e-1fd6f882ea55"
  );
  const [queueARN, setQueueArn] = useState(
    "a81629fc-0c52-4589-ace8-34c2e2818e39"
  );
  const [isCalling, setIsCalling] = useState(false);

  const [buttonState, setButtonState] = useState("enabled");
  //for testing hard coded destination phone number
  var testnumber = "19253329769"; // for testing only
  //var testnumber = "523222150066";

  var testing = false; //change this flag if not testing code

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const update = async () => {
      if (typeof navigator !== "undefined") {
        try {
          await import("amazon-connect-streams");
          connect.getLog().setLogLevel(connect.LogLevel.DEBUG);

          try {
            connect.core.initCCP(ref.current, {
              ccpUrl: "https://tbi-test-connect.my.connect.aws/connect/ccp-v2",
              region: "us-east-1",
              loginPopup: true,
              loginPopupAutoClose: true,
              loginOptions: {
                autoClose: true,
                height: 600,
                width: 400,
                top: 0,
                left: 0,
              },
              softphone: {
                allowFramedSoftphone: true,
                disableRingtone: false,
              },
              pageOptions: {
                enableAudioDeviceSettings: true,
                enablePhoneTypeSettings: true,
              },
              contactFlowId,
              ccpAckTimeout: 5000,
              ccpSynTimeout: 3000,
              ccpLoadTimeout: 10000,
            });
          } catch (error) {
            console.error("CCP Initialization Error:", error);
            console.log("Error details:", JSON.stringify(error, null, 2));
          }
          global.connect.agent((agent) => {
            console.log("Agent initialized");

            agent.onStateChange((state) => {
              console.log("Agent state changed:", state);
            });

            agent.onError((error) => {
              console.error("Agent error:", error);
            });

            agent.onRoutableState((routableState) => {
              console.log("Agent routable state:", routableState);
            });
          });
        } catch (error) {
          console.error("Error initializing CCP:", error);
        }
      }
    };
    update();
  }, [ref]);

  const outBoundCall = async () => {
    // Reset error state
    setErrorMessage("");

    // Set loading and calling states
    setIsLoading(true);
    setButtonState("callActived");
    setIsCalling(true);

    // Prepare phone number
    const formattedPhoneNum = testing ? testnumber : "1" + phoneNum.replace(/\D/g, "");
    
    setDestPhone(formattedPhoneNum);
    console.log("formattedPhoneNum", formattedPhoneNum);
    try {
      // Make API call
      const { data } = await axios.get(
        `https://o2xpogtamg.execute-api.us-east-1.amazonaws.com/dev/GetConnectManager?destPhone=%2B${formattedPhoneNum}&queueARN=${queueARN}&sourcePhone=%2B${sourcePhone}&instanceId=${instanceId}&contactFlowId=${contactFlowId}&buyer_Identifier=${buyer_Identifier}`,
        { timeout: 10000 } // Add timeout to prevent hanging requests
      );

      // Process successful response
      const contactId = JSON.parse(data?.body).ContactId;
      setContactId(contactId);
      setButtonState("hangUpActived");
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("API call error:", error);

      // Handle retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prevCount => prevCount + 1);
        setErrorMessage(`Call failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);

        // Wait before retrying
        setTimeout(() => {
          outBoundCall();
        }, 2000);
        return;
      } else {
        // Max retries reached, reset states
        setIsCalling(false);
        setButtonState("enabled");
        setErrorMessage("Call failed. Please try again later.");
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectCall = async () => {
    // Reset error state
    setErrorMessage("");

    // Set loading state
    setIsLoading(true);
    setIsCalling(false);

    try {
      if (!contactId) {
        setErrorMessage("No active call to disconnect");
        setButtonState("enabled");
        return;
      }

      // Make API call to hang up
      const { data } = await axios.get(
        `https://o2xpogtamg.execute-api.us-east-1.amazonaws.com/dev/HangUp?contactId=${contactId}&instanceId=${instanceId}`,
        { timeout: 10000 } // Add timeout to prevent hanging requests
      );

      if (contactId) {
        try {
          console.log("[BUYER IDENTIFIER]:", buyer_Identifier);
          // Save call record
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASEURL}/save-new-call`,
            {
              contactId,
              buyer_id: buyer_Identifier,
            },
            { timeout: 10000 } // Add timeout
          );
          console.log("[RESPONSE FROM THE SAVE NEW CALL API]:", response);
        } catch (err) {
          console.error("[ERROR while posting the call record]:", err);
          setErrorMessage("Call ended, but failed to save call record");
        }
      }

      // Reset states
      setButtonState("enabled");
      setContactId("");
    } catch (error) {
      console.error("Error disconnecting call:", error);
      setErrorMessage("Failed to disconnect call. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const openCCP = () => {
    window.open(
      "https://tbi-test-connect.my.connect.aws/connect/ccp-v2",
      "_blank"
    );
  };
  return (
    <>
      {/* Button to open the CCP - Moved above the phone buttons */}
      <Button className="mb-8" type="primary" size="large" onClick={openCCP}>
        Open Amazon Connect CCP
      </Button>

      {/* Error message display */}
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-center">
        <div className="flex gap-[3rem] md:gap-[6rem] border-2 pt-2 pb-2 pl-10 pr-10 border-[#CCCCCC] rounded-full">
          <div className="relative">
            <DialCallIcon outBoundCall={outBoundCall} isCalling={isCalling} />
            {isLoading && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </div>
          <CutCallIcon disconnectCall={disconnectCall} />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          <span>Connecting...</span>
        </div>
      )}

      {/* CCP Container */}
      {/* <div ref={ref} style={{ display: "none" }} /> */}
      {/* <div className="flex justify-between mb-5">
        <CallButton status={buttonState} acceptHandler={outBoundCall} />
        <HangUpButton status={buttonState} disconnectHandler={disconnectCall} />
        <CallInputs
          source={sourcePhone}
          setSource={setSourcePhone}
          dest={destPhone}
          setDest={setDestPhone}
          flowId={contactFlowId}
          setFlowId={setContactFlowId}
          instance={instanceId}
          setInstance={setConnectInstanceId}
          queueArn={queueARN}
          setQueue={setQueueArn}
        />
      </div> */}
    </>
  );
};

export default memo(ConnectCCP);
