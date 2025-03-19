"use client";
import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import axios from "axios";
import AiChat from "./AiChat";
import ConnectCCP from "./ConnectCCP.jsx";
import {
  Button,
  Col,
  Collapse,
  CollapseProps,
  Input,
  Row,
  Select,
  Modal as AntDModal,
} from "antd";
import { jwtDecode } from "jwt-decode";
const { TextArea } = Input;
import PreviousIconUrl from "@Image/PreviousIcon.svg";
import NextIconUrl from "@Image/NextIcon.svg";
import Image from "next/image";
import SearchIconUrl from "@Image/SearchIcon.svg";
import DownIconUrl from "@Image/DownIcon.svg";
const { Option } = Select;
import PersonIconUrl from "@Image/PersonIconDark.svg";
import CompanyIconUrl from "@Image/CompanyIcon.svg";
import TitleIconUrl from "@Image/TitleIcon.svg";
import PhoneIconUrl from "@Image/PhoneIcon.svg";
import EmailIconUrl from "@Image/FooterMailIcon.svg";
import LocationIconUrl from "@Image/LocationIcon.svg";
import CampaignIconUrl from "@Image/CompaignIcon.svg";
import PlusExpandIconUrl from "@Image/PlusExpandIcon.svg";
import MinusCollapseIconUrl from "@Image/MinusCollapseIcon.svg";

import TickIconUrl from "@Image/TickIconBlueBG.svg";
import TickIconWhiteBG from "@Image/TickIconWhiteBG.svg";
import CallLogs from "./CallLogs";
import {
  fifthSectionText,
  firstSectionText,
  fourthSectionText,
  secondSectionText,
  seventhSectionText,
  sixthSectionText,
  // callerGuideSectionText,
  // emailGuideText
} from "@/config/CallerDahsboardPageText";
import CallScript from "./CallScript";
// import CallerGuide from "./CallerGuide";
// import EmailGuide from "./EmailGuide";

type Props = {
  records: any[];
};

const CallerDashboard = ({ records }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<any>(null);
  const [a1, setA1] = useState(false);
  const [a2, setA2] = useState(false);
  const [a3, setA3] = useState(false);
  const [note, setNote] = useState("");
  const [openFAQModal, setOpenFAQModal] = useState<boolean>(false);
  const viewHandler = (payload: any) => {
    setOpenFAQModal(true);
    setSelectedFaq(payload);
  };

  const handleNext = () => {
    if (currentIndex < records.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveButtonHandler = async () => {
    try {
      const userEmail = (
        jwtDecode(localStorage.getItem("accessToken") ?? "") as any
      ).email;

      let payload = {
        values: [a1, a2, a3],
        titles: ["title_wrong", "number_wrong", "DND"],
        note,
        user_email: userEmail,
      };

      const endpoint = `${process.env.NEXT_PUBLIC_API_BASEURL}/feedback/call-notes`;
      const result = await axios.post(endpoint, payload);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const initialState = () => {
    setA1(false);
    setA2(false);
    setA3(false);
    setNote("");
  };

  const call_script = [
    {
      uuid: "ss_a4",
      category: "linkedin_post",
      title: "Question #1",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "linkedin_post";
        }
      )[0],
    },
    {
      uuid: "bs_a5",
      category: "persona_news",
      title: "Question #2",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "persona_news";
        }
      )[0],
    },
    {
      uuid: "ss_a2",
      category: "company_news",
      title: "Question #3",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "company_news";
        }
      )[0],
    },
    {
      uuid: "ss_a3",
      category: "annualreport_priority",
      title: "Question #4",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "annualreport_priority";
        }
      )[0],
    },
    {
      uuid: "bs_a3",
      category: "ceo_priority",
      title: "Question #5",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "ceo_priority";
        }
      )[0],
    },
    {
      uuid: "intro",
      category: "buyer_investments",
      title: "Question #6",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "buyer_investments";
        }
      )[0],
    },
    {
      uuid: "bs_a1",
      category: "website_priority",
      title: "Question #7",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "website_priority";
        }
      )[0],
    },
    {
      uuid: "bs_a4",
      category: "buyer_values",
      title: "Question #8",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "buyer_values";
        }
      )[0],
    },
    {
      uuid: "ss_a1",
      category: "buyer_awards",
      title: "Question #9",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "buyer_awards";
        }
      )[0],
    },
    {
      uuid: "bs_a2",
      category: "persona_challenge",
      title: "Question #10",
      body: records?.[currentIndex]?.Call_scripts?.filter(
        (call_script: any) => {
          return call_script.Topics.category === "persona_challenge";
        }
      )[0],
    },
  ];

  const RenderInfoTable = () => {
    if (!records || records.length === 0) {
      return (
        <div className="flex items-center justify-center w-100 h-100">
          <div className="text-2xl font-semibold">Record not found</div>
        </div>
      );
    }

    return (
      <div className="w-100 ml-[5%] md:ml-[15%] mr-[5%] md:mr-[15%] pt-[1%] pb-[1%] pl-[5%] pr-[5%] shadow-md border">
        <Row gutter={[80, 32]}>
          <Col span={24} className="w-100">
            <div className="w-100 flex items-center justify-between">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={handlePrev}
              >
                <Image
                  src={PreviousIconUrl}
                  alt="previous"
                  className="w-[0.8rem] md:w-[1.2rem]"
                />
                <div className="text-[0.8rem] md:text-[1rem]">Previous</div>
              </div>
              <div className="w-[50%] md:w-[30%]">
                <Input.Group
                  compact
                  size="small"
                  style={{
                    display: "flex",
                    borderRadius: "50px",
                    overflow: "hidden",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <Input
                    style={{
                      width: "30px",
                      border: "none",
                      textAlign: "center",
                    }}
                    prefix={<Image src={SearchIconUrl} alt="search" />}
                    disabled
                  />
                  <Select
                    style={{ width: "calc(100% - 30px)", border: "none" }}
                    placeholder="Search by Company"
                    suffixIcon={<Image src={DownIconUrl} alt="down" />}
                    bordered={false}
                    dropdownStyle={{ borderRadius: "10px" }}
                    onSelect={(value) => {
                      if (value === "All") {
                        setCurrentIndex(0);
                      } else {
                        setCurrentIndex(
                          records?.findIndex(
                            (record) => record.company === value
                          )
                        );
                      }
                    }}
                  >
                    <Option value="All">----</Option>
                    {records?.map((record) => {
                      return (
                        <Option key={record.company} value={record.company}>
                          {record.company}
                        </Option>
                      );
                    })}
                  </Select>
                </Input.Group>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleNext}
              >
                <div className="text-[0.8rem] md:text-[1rem]">Next</div>
                <Image
                  src={NextIconUrl}
                  alt="next"
                  className="w-[0.8rem] md:w-[1.2rem]"
                />
              </div>
            </div>
          </Col>
          {[
            {
              label: "First Name",
              value: records?.[currentIndex]?.f_name,
              IconUrl: PersonIconUrl,
            },
            {
              label: "Last Name",
              value: records?.[currentIndex]?.l_name,
              IconUrl: PersonIconUrl,
            },
            {
              label: "Company",
              value: records?.[currentIndex]?.company,
              IconUrl: CompanyIconUrl,
            },
            {
              label: "Title",
              value: records?.[currentIndex]?.title,
              IconUrl: TitleIconUrl,
            },
            {
              label: "Phone",
              value: records?.[currentIndex]?.phone,
              IconUrl: PhoneIconUrl,
            },
            {
              label: "Email",
              value: records?.[currentIndex]?.email,
              IconUrl: EmailIconUrl,
            },
            {
              label: "Location",
              value: records?.[currentIndex]?.location,
              IconUrl: LocationIconUrl,
            },
            {
              label: "Campaign.S",
              value: records?.[currentIndex]?.s_no,
              IconUrl: CampaignIconUrl,
            },
          ]?.map(({ label, value, IconUrl }, index) => {
            return (
              <Col span={24} md={12} key={index}>
                <div className="">
                  <div className="flex gap-2 items-center">
                    <Image src={IconUrl} alt="" />
                    <div>{label}</div>
                  </div>
                  <Input
                    style={{
                      border: "none",
                      cursor: "auto",
                      paddingLeft: "1.5rem",
                      marginTop: "0.5rem",
                      borderRadius: "0",
                    }}
                    value={value}
                    disabled
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  const getItems: () => CollapseProps["items"] = () => {
    const CollapseItems = call_script?.map((item) => {
      return {
        key: `${item.uuid}`,
        label: (
          <div className="text-xl md:text-2xl font-medium w-100">
            {item.title}
          </div>
        ),
        children: <CallScript call_script={item} />,
        style: { width: "100%", backgroundColor: "inherit" },
      };
    });
    return CollapseItems;
  };

  const RenderCallScript = () => {
    return (
      <div className="flex flex-col gap-8 items-center mt-[3%] ml-[5%] md:ml-[10%] mr-[5%] md:mr-[10%]">
        <div className="text-2xl md:text-3xl font-semibold">
          {secondSectionText.title}
        </div>
        <div className="w-[100%] border-2 rounded shadow-md">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <Image
                src={!isActive ? PlusExpandIconUrl : MinusCollapseIconUrl}
                alt="expand"
                className="w-[0.9rem] md:w-[1.2rem]"
              />
            )}
            expandIconPosition="end"
            style={{ padding: "1rem", width: "100%" }}
            items={getItems()}
            collapsible={"icon"}
            ghost={true}
          />
        </div>
      </div>
    );
  };

  // const RenderCallerGuide = () => {
  //   return (
  //     <>
  //       <CallerGuide caller_guide_text={callerGuideSectionText} call_script={call_script} />
  //     </>
  //   )
  // }

  // const RenderEmailGuide = () => {
  //   return (
  //     <>
  //       <EmailGuide email_guide_text={emailGuideText} call_script={call_script} />
  //     </>
  //   )
  // }

  const RenderCallHistory = () => {
    return (
      <>
        <CallLogs
          buyer_identifier={records?.[currentIndex]?.buyer_identifier}
        />
      </>
    );
  };

  const RenderFAQ = () => {
    return (
      <div className="mt-[4%] mx-[5%] md:mx-[10%] flex flex-col items-center gap-6 text-4xl font-semibold">
        <AntDModal
          centered={true}
          title={"FAQ"}
          open={openFAQModal}
          onCancel={() => {
            setOpenFAQModal(false);
          }}
          footer={null}
        >
          <div>{`${selectedFaq?.q ?? "Question"}?`}</div>
          <div className="max-h-40 overflow-y-auto">{`${selectedFaq?.a ?? "Answer"
            }.`}</div>
        </AntDModal>
        <div>{fourthSectionText.title}</div>
        <div className="w-[90%] border p-6 shadow-sm rounded">
          <Row gutter={[32, 48]}>
            {records?.[currentIndex]?.Campaigns?.Faqs.map((item: any) => {
              return (
                <Col span={8} key={item.id}>
                  <div
                    onClick={() =>
                      viewHandler({
                        a: item.faq_answer,
                        q: item.faq_question,
                      })
                    }
                    className="w-100% bg-[#BAE4F1] rounded-xl h-[3rem] cursor-pointer px-4 py-2 text-lg"
                  >
                    {item.faq_question}
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    );
  };

  const RenderCallNotes = () => {
    return (
      <div className="mt-[3%] mx-[5%] md:mx-[15%] flex flex-col items-center gap-8">
        <div className="text-4xl font-semibold">{fifthSectionText.title}</div>
        <div className="flex items-center justify-between gap-10">
          <div
            onClick={() => setA1((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-[2rem] border-2 rounded-full">
              <Image src={a1 ? TickIconUrl : TickIconWhiteBG} alt="tick" />
            </div>
            <div>{fifthSectionText.check1text}</div>
          </div>
          <div
            onClick={() => setA2((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-[2rem] border-2 rounded-full">
              <Image src={a2 ? TickIconUrl : TickIconWhiteBG} alt="tick" />
            </div>
            <div>{fifthSectionText.check2text}</div>
          </div>
          <div
            onClick={() => setA3((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-[2rem] border-2 rounded-full">
              <Image src={a3 ? TickIconUrl : TickIconWhiteBG} alt="tick" />
            </div>
            <div>{fifthSectionText.check3text}</div>
          </div>
        </div>
        <div className="w-[70%]">
          <TextArea
            value={note}
            onChange={(e) => {
              e.preventDefault();
              setNote(e.target.value);
            }}
            placeholder="Call Note"
            autoSize={{ minRows: 8 }}
          />
        </div>
        <div>
          <Button
            onClick={saveButtonHandler}
            type="primary"
            shape="round"
            className="p-5"
          >
            Submit
          </Button>
        </div>
      </div>
    );
  };

  const RenderProductServiceQN = () => {
    return (
      <div className="mt-10 mx-[5%] md:mx-[15%] flex flex-col gap-4 items-center">
        <div className="text-4xl font-semibold">{sixthSectionText.title}</div>
        <div className="font-medium">{sixthSectionText.subTitle}</div>
        <AiChat />
      </div>
    );
  };

  const RenderQNSection = () => {
    return (
      <div className="mt-10 mx-[5%] md:mx-[15%] flex flex-col gap-4 items-center">
        <div className="text-4xl font-semibold">{seventhSectionText.title}</div>
        <div className="font-medium">{seventhSectionText.subTitle}</div>
        <AiChat />
      </div>
    );
  };

  return (
    <div className="mt-[10%] md:mt-[5%]">
      <div className=" flex flex-col items-center">
        <div className="flex flex-col items-center py-10">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 font-semibold text-center">
            {firstSectionText.title}
          </div>
          <p className="text-[0.7rem] md:text-[1rem] font-medium text-center">
            {firstSectionText.subTitle}
          </p>
        </div>

        {RenderInfoTable()}

        <ConnectCCP
          phoneNum={records?.[currentIndex]?.phone}
          buyer_Identifier={records?.[currentIndex]?.buyer_identifier}
        />
      </div>
      {RenderCallScript()}
      {/* {RenderCallerGuide()}
      {RenderEmailGuide()} */}
      {RenderCallHistory()}
      {RenderFAQ()}
      {RenderCallNotes()}
      {RenderProductServiceQN()}
      {RenderQNSection()}
    </div>
  );
};

export default CallerDashboard;
