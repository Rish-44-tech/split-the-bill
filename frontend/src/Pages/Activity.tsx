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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Activity</h1>
          <p className="text-sm text-slate-500">
            A real-time ledger of expenses, payments, and updates across your
            circles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="bg-white border border-slate-200 text-sm font-medium text-slate-700 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            onChange={(event) => {
              setGroupFilter((event.target.value!="All Groups") ? event.target.value : "all");
            }}
          >
            {[<option>All Groups</option>, ...filterOptions]}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">

        {activity.map((element) => {
          return (
            <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors gap-4">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm text-slate-600 font-normal">
                    <span className="font-semibold text-slate-900">
                      {element.createdBy}
                    </span>{" "}
                    added{" "}
                    <span className="font-semibold text-slate-900">
                      "{element.description}"
                    </span>{" "}
                    in{" "}
                    <span className="font-medium text-slate-900">
                      {element.group}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">
                    {/* {element.createdAt} */}
                    9/7/2026, 1030
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-slate-400 font-medium block">
                  {element.nature === "NULL" ? "" : element.nature }
                </span>
                <span
                  className={`text-sm font-bold text-${element.nature === "You owe" ? "orange-600" : "emerald-600"}`}
                >
                  {element.amount===0 || !element.amount ? "No dues" :`Rs.${element.amount}` }
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
