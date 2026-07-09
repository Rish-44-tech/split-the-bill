import { useOutletContext } from "react-router";

export default function Dashboard() {
  const userDetails: { name: string; email: string } = useOutletContext();
  return (
    <>
      {" "}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Summary</h1>
        <p className="text-sm text-slate-500">
          An overview of your balances across all expense groups.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Total Balance
          </span>
          <span className="text-3xl font-bold text-slate-800">$0.00</span>
        </div>
        <div className="flex flex-col gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-orange-500">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            You owe
          </span>
          <span className="text-3xl font-bold text-orange-600">$0.00</span>
        </div>
        <div className="flex flex-col gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            You are owed
          </span>
          <span className="text-3xl font-bold text-emerald-600">$0.00</span>
        </div>
      </div>
      {/* 🎯 Place this container immediately below your metrics grid <div> */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Balances Breakdown (Takes 3 columns on large screens) */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Owed Breakdown</h3>
            <p className="text-xs text-slate-500">
              A detailed look at who you owe or who owes you.
            </p>
          </div>

          {/* List Container */}
          <div className="flex flex-col gap-3 mt-2">
            {/* Row Item: You are owed (Green) */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  JD
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800">
                    John Doe
                  </div>
                  <div className="text-xs text-slate-500">in 🚗 Road Trip</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">
                  owes you
                </div>
                <div className="font-bold text-emerald-600">$45.00</div>
              </div>
            </div>

            {/* Row Item: You owe (Orange) */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50/50 border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                  AS
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800">
                    Alex Smith
                  </div>
                  <div className="text-xs text-slate-500">
                    in 🏢 Apartment Split
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">
                  you owe
                </div>
                <div className="font-bold text-orange-600">$12.50</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity Feed (Takes 2 columns on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h3>
            <p className="text-xs text-slate-500">
              Latest updates across all your groups.
            </p>
          </div>

          {/* Timeline List */}
          <div className="flex flex-col gap-4 mt-2 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {/* Activity Item 1 */}
            <div className="flex gap-3 relative items-start">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-white z-10 text-sm">
                🛒
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    Alex Smith
                  </span>{" "}
                  added{" "}
                  <span className="font-medium text-slate-900">
                    "Groceries"
                  </span>
                </p>
                <span className="text-xs text-slate-400">
                  2 hours ago • Apartment Split
                </span>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex gap-3 relative items-start">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-white z-10 text-sm">
                ⛽
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">You</span>{" "}
                  added{" "}
                  <span className="font-medium text-slate-900">"Gasoline"</span>
                </p>
                <span className="text-xs text-slate-400">
                  Yesterday • Road Trip
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
