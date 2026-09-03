import { useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Activity() {
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [activity, setActivity] = useState<
    {
      expenseId?: number;
      description?: string;
      group?: string;
      createdBy?: string;
      nature?: string;
      amount?: number;
      createdAt?: Date;
    }[]
  >([]);

  const [userDetails, groups]: [
    userDetails: { id: number; name: string; email: string },
    groups: { id: number; name: string; createdAt: Date }[],
    () => Promise<void>,
  ] = useOutletContext();

  const filterOptions = groups.map((group) => {
    return <option>{group.name}</option>;
  });

  useEffect(() => {
    const getActivity = async () => {
      const response = await axios.get(`/api/${userDetails.id}/activity?filter=${groupFilter}`);
      setActivity(response.data);
    };
    getActivity();
  }, [userDetails.id,groupFilter]);

  return (
    <>
      <title>Activity</title>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-[#D8D9CD] mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#16211C] font-['Inter']">
            Your Activity
          </h1>
          <p className="text-sm text-[#6B7268] mt-1 font-['Inter']">
            A history of expenses and payments across your groups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="bg-white border border-[#D8D9CD] text-sm font-medium text-[#16211C] font-['Inter'] px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]"
            onChange={(event) => {
              setGroupFilter((event.target.value!="All Groups") ? event.target.value : "all");
            }}
          >
            {[<option>All Groups</option>, ...filterOptions]}
          </select>
        </div>
      </div>

      <div className="border-t border-[#D8D9CD]">
        {activity.map((element) => {
          return (
            <div className="flex items-center justify-between py-4 border-b border-[#D8D9CD] hover:bg-[#EFF0E9] transition-colors gap-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2F6F5E] mt-2 shrink-0"></div>
                <div>
                  <p className="text-[14px] text-[#16211C] font-['Inter']">
                    <span className="font-medium">{element.createdBy}</span>{" "}
                    added{" "}
                    <span className="font-medium">"{element.description}"</span>{" "}
                    in{" "}
                    <span className="font-medium">{element.group}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#6B7268] font-['Inter']">
                    9/7/2026, 10:30
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[11px] text-[#6B7268] font-['Inter'] block">
                  Your share
                </span>
                <span className="text-[14px] font-semibold text-[#16211C] font-['Inter']">
                  {element.amount === 0 || !element.amount
                    ? "Not involved"
                    : `\u20b9${element.amount}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}