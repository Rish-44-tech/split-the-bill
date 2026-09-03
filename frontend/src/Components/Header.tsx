import logo from "/photos/logo.jpg";
import { NavLink } from "react-router";

export default function Header({
  userDetails,
  groups,
}: {
  userDetails: { id: number; name: string; email: string };
  groups: { id: number; name: string; createdAt: Date }[];
}) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 h-8 flex items-center text-[13px] font-medium font-['Inter'] rounded-full transition-colors whitespace-nowrap ${
      isActive
        ? "bg-[#16211C] text-[#F6F7F1]"
        : "text-[#6B7268] hover:text-[#16211C] hover:bg-[#EFF0E9]"
    }`;

  const groupClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 h-8 flex items-center text-[13px] font-medium font-['Inter'] rounded-full transition-colors whitespace-nowrap ${
      isActive
        ? "bg-[#2F6F5E] text-white"
        : "text-[#6B7268] hover:text-[#16211C] hover:bg-[#EFF0E9]"
    }`;

  return (
    <header className="border-b border-[#D8D9CD] bg-[#F6F7F1]">
      {/* Top row: brand + user + logout */}
      <div className="flex h-[64px] items-center gap-4 px-6">
        <div className="flex-shrink-0">
          <img className="h-8 block" src={logo} alt="website logo" />
        </div>

        <div
          className="text-[19px] text-[#16211C] font-['Fraunces']"
          style={{ fontWeight: 500 }}
        >
          Split The Bill
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-medium text-[#16211C] font-['Inter']">
              {userDetails.name}
            </div>
            <div className="text-[11px] text-[#6B7268] font-['Inter']">
              {userDetails.email}
            </div>
          </div>
          <button className="h-9 px-4 rounded-full border border-[#D8D9CD] bg-white text-sm font-medium text-[#16211C] font-['Inter'] transition-colors hover:bg-[#EFF0E9] active:scale-95">
            Logout
          </button>
        </div>
      </div>

      {/* Bottom row: nav tabs + group tabs */}
      <div className="flex items-center gap-1 px-6 h-12 border-t border-[#D8D9CD] overflow-x-auto">
        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>
        {/* <NavLink to="/activity" className={navClass}>
          Activity
        </NavLink> */}

        <div className="w-px h-5 bg-[#D8D9CD] mx-2 flex-shrink-0" />

        {groups.map((group: { id: number; name: string; createdAt: Date }) => (
          <NavLink key={group.id} to={`/group/${group.id}`} className={groupClass}>
            {group.name}
          </NavLink>
        ))}

        <button className="px-3 h-8 flex items-center gap-1 text-[13px] font-medium font-['Inter'] text-[#6B7268] border border-dashed border-[#D8D9CD] rounded-full whitespace-nowrap hover:border-[#16211C] hover:text-[#16211C] transition-colors flex-shrink-0">
          + New group
        </button>
      </div>
    </header>
  );
}