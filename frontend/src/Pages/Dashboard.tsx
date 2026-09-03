import { useOutletContext } from "react-router";
import { useState,useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [userDetails,,]: [
    userDetails: { id: number; name: string; email: string },
    { id: number; name: string; createdAt: Date }[],
    () => Promise<void>,
  ] = useOutletContext();

  const [recAct,setRecAct]=useState([]);

  useEffect(()=>{
    const getRecAct= async ()=>{
      const response = await axios.get(`/api/${userDetails.id}/activity?recent=true&filter=all`);
      setRecAct(response.data);
    };
    console.log(recAct);
    getRecAct();
  },[userDetails.id]);

  return (
    <>
      <title>Dashboard</title>


      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[#16211C] font-['Inter']">
          Dashboard Summary
        </h1>
        <p className="text-sm text-[#6B7268] mt-1 font-['Inter']">
          An overview of your balances across all expense groups.
        </p>
      </div>

      {/* Hero balance */}
      <div className="mb-10 pb-8 border-b border-[#D8D9CD]">
        <div className="text-[13px] text-[#6B7268] mb-2 font-['Inter']">
          Total balance
        </div>
        <div
          className="text-[48px] leading-none text-[#16211C] font-['Fraunces']"
          style={{ fontWeight: 500 }}
        >
          $0.00
        </div>
        <div className="flex gap-10 mt-6">
          <div>
            <div className="text-[12px] text-[#6B7268] font-['Inter']">You owe</div>
            <div className="text-[20px] text-[#9C3D54] font-medium font-['Inter']">
              $0.00
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#6B7268] font-['Inter']">
              You are owed
            </div>
            <div className="text-[20px] text-[#2F6F5E] font-medium font-['Inter']">
              $0.00
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Left: Owed Breakdown */}
        <div className="lg:col-span-3">
          <h3
            className="text-[16px] text-[#16211C] font-['Fraunces']"
            style={{ fontWeight: 500 }}
          >
            Owed Breakdown
          </h3>
          <p className="text-xs text-[#6B7268] mt-1 font-['Inter']">
            A detailed look at who you owe or who owes you.
          </p>

          <div className="mt-4 border-t border-[#D8D9CD]">
            <div className="flex items-center justify-between py-4 border-b border-[#D8D9CD]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#16211C] text-[#F6F7F1] flex items-center justify-center text-xs font-medium font-['Inter']">
                  JD
                </div>
                <div>
                  <div className="text-[14px] font-medium text-[#16211C] font-['Inter']">
                    John Doe
                  </div>
                  <div className="text-[12px] text-[#6B7268] font-['Inter']">
                    Road Trip
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#6B7268] font-['Inter']">
                  owes you
                </div>
                <div className="text-[15px] font-medium text-[#2F6F5E] font-['Inter']">
                  $45.00
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-[#D8D9CD]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#16211C] text-[#F6F7F1] flex items-center justify-center text-xs font-medium font-['Inter']">
                  AS
                </div>
                <div>
                  <div className="text-[14px] font-medium text-[#16211C] font-['Inter']">
                    Alex Smith
                  </div>
                  <div className="text-[12px] text-[#6B7268] font-['Inter']">
                    Apartment Split
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#6B7268] font-['Inter']">
                  you owe
                </div>
                <div className="text-[15px] font-medium text-[#9C3D54] font-['Inter']">
                  $12.50
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity — recAct logic untouched */}
        <div className="lg:col-span-2">
          <h3
            className="text-[16px] text-[#16211C] font-['Fraunces']"
            style={{ fontWeight: 500 }}
          >
            Recent Activity
          </h3>
          <p className="text-xs text-[#6B7268] mt-1 font-['Inter']">
            Latest updates across all your groups.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {recAct.map((element) => {
              return (
                <div className="flex gap-3" key={element.expenseId}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2F6F5E] mt-2 shrink-0"></div>
                  <div>
                    <p className="text-[14px] text-[#16211C] font-['Inter']">
                      <span className="font-medium">{element.createdBy}</span>{" "}
                      added{" "}
                      <span className="font-medium">{element.description}</span>
                    </p>
                    <span className="text-[12px] text-[#6B7268] font-['Inter']">
                      {element.createdAt} · {element.group}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}