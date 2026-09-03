import logo from "/photos/logo.jpg";
import { NavLink } from "react-router";
import axios from 'axios';
import {useState} from 'react';
import {X} from 'lucide-react';

export default function Header({
  userDetails,
  groups,
  getGroups,
}: {
  userDetails: { id: number; name: string; email: string };
  groups: { id: number; name: string; createdAt: Date }[];
  getGroups: ()=> Promise<void>,
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

  const [addGroupClicked,setAddGroupClicked]=useState(false);
  const [groupName,setGroupName]=useState("");

  return (
    <>
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

        <button className="px-3 h-8 flex items-center gap-1 text-[13px] font-medium font-['Inter'] text-[#6B7268] border border-dashed border-[#D8D9CD] rounded-full whitespace-nowrap hover:border-[#16211C] hover:text-[#16211C] transition-colors flex-shrink-0"
        onClick={()=>{setAddGroupClicked(!addGroupClicked);}}>
          + New group
        </button>
      </div>
    </header>
    {addGroupClicked &&
<div className="fixed inset-0 bg-[#16211C]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  
  <div className="bg-[#F6F7F1] rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
    
    <div className="flex items-center justify-between mb-6">
      <h2
        className="text-xl text-[#16211C] font-['Fraunces']"
        style={{ fontWeight: 500 }}
      >
        Add Group
      </h2>
      <button className="text-[#6B7268] hover:text-[#16211C] transition-colors">
        <X size={20} onClick={()=>{
          setAddGroupClicked(!addGroupClicked);
          setGroupName("");
        }}/>
      </button>
    </div>

    
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Group Name
        </label>
        <input
          type="text"
          value={groupName}
          placeholder="e.g. Goa Trip"
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
          onChange={(event)=>{setGroupName(event.target.value)}}
          onKeyDown={async (event)=>{
            if(event.key==="Enter"){
              if(groupName!=""){
                await axios.post(`/api/groups`,{
                  name:groupName,
                  creatorId:userDetails.id
                });
                getGroups();
                setAddGroupClicked(!addGroupClicked);
                setGroupName("");
              }
            }
          }}
        />
      </div>
    </div>

    <div className="flex items-center justify-end gap-3 mt-8">
      <button className="px-4 py-2.5 text-sm font-medium font-['Inter'] text-[#6B7268] hover:text-[#16211C] transition-colors"
      onClick={()=>{
        setAddGroupClicked(!addGroupClicked);
        setGroupName("");
        }}>
        Cancel
      </button>
      <button className="px-5 py-2.5 bg-[#2F6F5E] hover:bg-[#265C4E] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150"
      onClick={async ()=>{
        await axios.post(`/api/groups`,{
          name:groupName,
          creatorId:userDetails.id
        });
        getGroups();
        setAddGroupClicked(!addGroupClicked);
        setGroupName("");
      }}>
        Create Group
      </button>
    </div>
  </div>
</div>
    }
    </>
  );
}