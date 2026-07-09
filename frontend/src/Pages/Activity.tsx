import { useOutletContext } from "react-router";

export default function Activity() {
  const [userDetails, groups, getGroups]: [
    userDetails: { name: string; email: string },
    groups: { id: number; name: string; createdAt: string }[],
    getGroups: () => Promise<void>,
  ] = useOutletContext();

  const filterOptions = groups.map((group)=>{
    return <option>{group.name}</option>
  })
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Activity</h1>
          <p className="text-sm text-slate-500">
            A real-time ledger of expenses, payments, and updates across your
            circles.
          </p>
        </div>

        {/* Optional Filter Controls */}
        <div className="flex items-center gap-2">
          <select className="bg-white border border-slate-200 text-sm font-medium text-slate-700 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
            {[<option>All Groups</option>,...filterOptions]}
          </select>
        </div>
      </div>

      {/* 🗓️ Grouping: Today */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Today
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
          {/* Activity Log Row 1: New Expense */}
          <div className="flex items-start justify-between p-4 hover:bg-slate-50/50 transition-colors gap-4">
            <div className="flex items-start gap-4">
              {/* Dynamic Badge Icon */}
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0 border border-blue-100">
                🍔
              </div>
              <div>
                <p className="text-sm text-slate-600 font-normal">
                  <span className="font-semibold text-slate-900">John Doe</span>{" "}
                  added{" "}
                  <span className="font-semibold text-slate-900">
                    "Dinner at Olive Garden"
                  </span>{" "}
                  in{" "}
                  <span className="font-medium text-slate-900">
                    🇮🇹 Foodies Crew
                  </span>
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  2 hours ago
                </span>
              </div>
            </div>
            {/* Amount Snapshot */}
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-slate-400 font-medium block">
                You borrow
              </span>
              <span className="text-sm font-bold text-orange-600">$18.50</span>
            </div>
          </div>

          {/* Activity Log Row 2: Settle Up Payment */}
          <div className="flex items-start justify-between p-4 hover:bg-slate-50/50 transition-colors gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0 border border-emerald-100">
                🤝
              </div>
              <div>
                <p className="text-sm text-slate-600 font-normal">
                  <span className="font-semibold text-slate-900">You</span>{" "}
                  settled up with{" "}
                  <span className="font-semibold text-slate-900">
                    Alex Smith
                  </span>
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  You paid $50.00
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  5 hours ago • 🏢 Apartment Split
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🗓️ Grouping: Yesterday */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Yesterday
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
          {/* Activity Log Row 3: You lent money */}
          <div className="flex items-start justify-between p-4 hover:bg-slate-50/50 transition-colors gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0 border border-blue-100">
                ⛽
              </div>
              <div>
                <p className="text-sm text-slate-600 font-normal">
                  <span className="font-semibold text-slate-900">You</span>{" "}
                  added{" "}
                  <span className="font-semibold text-slate-900">
                    "Gasoline Fillup"
                  </span>{" "}
                  in{" "}
                  <span className="font-medium text-slate-900">
                    🚗 Road Trip
                  </span>
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  Yesterday at 4:15 PM
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-slate-400 font-medium block">
                You lend
              </span>
              <span className="text-sm font-bold text-emerald-600">$35.00</span>
            </div>
          </div>

          {/* Activity Log Row 4: Group Update Metadata */}
          <div className="flex items-start justify-between p-4 hover:bg-slate-50/50 transition-colors gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-base flex-shrink-0 border border-slate-200">
                ⚙️
              </div>
              <div>
                <p className="text-sm text-slate-600 font-normal">
                  <span className="font-semibold text-slate-900">
                    Sarah Jenkins
                  </span>{" "}
                  renamed the group to{" "}
                  <span className="font-medium text-slate-900">
                    "Weekend Getaway ✈️"
                  </span>
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  Yesterday at 11:30 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
