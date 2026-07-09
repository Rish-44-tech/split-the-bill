import { NavLink } from "react-router";

export default function Sidebar({
  userDetails, groups
}: {
  userDetails: { name: string; email: string };
  groups: { id: number; name: string; createdAt: string }[];
}) {
  return (
    <div className="flex flex-col gap-6 w-64 overflow-hidden p-6 bg-slate-50 border-r border-slate-200 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <div className="font-semibold text-slate-800 text-base truncate">
          {userDetails.name}
        </div>
        <div className="text-xs text-slate-500 truncate">
          {userDetails.email}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
              isActive
                ? "bg-slate-900/10 text-slate-900 font-semibold shadow-sm"
                : "text-slate-600 font-medium hover:bg-slate-200/50 hover:text-slate-900"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/activity"
          className={({ isActive }) =>
            `w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
              isActive
                ? "bg-slate-900/10 text-slate-900 font-semibold shadow-sm"
                : "text-slate-600 font-medium hover:bg-slate-200/50 hover:text-slate-900"
            }`
          }
        >
          Activity
        </NavLink>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        <div className="text-xs font-bold tracking-wider text-slate-400 uppercase px-3">
          Your Groups
        </div>
        <div className="flex flex-col gap-1 px-3 text-sm text-slate-600">
          {groups.map(
            (group: { id: number; name: string; createdAt: string }) => {
              return (
                <NavLink
                  to={`/group/${group.id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] ${
                      isActive
                        ? "bg-slate-900/10 text-slate-900 font-semibold shadow-sm"
                        : "text-slate-600 font-medium hover:bg-slate-200/50 hover:text-slate-900"
                    }`
                  }
                >
                  <div key={group.id}>{group.name}</div>
                </NavLink>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-dashed border-slate-300 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-100 hover:border-slate-400 text-slate-700 transition-all active:scale-[0.98]">
          + Create a Group
        </button>
      </div>
    </div>
  );
}
