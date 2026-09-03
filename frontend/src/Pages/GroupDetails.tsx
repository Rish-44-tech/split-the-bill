import { useOutletContext, useParams } from "react-router";
import { useState,useEffect } from "react";
import axios from "axios";
import { ArrowRight, X, ChevronDown } from "lucide-react";

export default function GroupDetails() {
  const [userDetails,groups,]: [
    userDetails: { id: number; name: string; email: string },
    groups:{ id: number; name: string; createdAt: Date }[],
    () => Promise<void>,
  ] = useOutletContext();

  const {groupId}=useParams();

  const groupName = groups.find((group)=>{
    return group.id===Number(groupId);
  })?.name;

  const [members,setMembers] = useState<{
    id: number;
    name: string;
    email: string;
  }[]>([]);

  const [expenses, setExpenses] = useState<{
    id: number;
    desrciption: string;
    amount: string;
    createdAt: string;
    groupId: number;
    paidById: number;
    paidBy: { name: string };
  }[]>([]);

  const [balances,setBalances] = useState<{
      userId: number;
      name: string;
      oweToId: number;
      oweTo: string;
      amount: number;
      groupName: string 
    }[]>([]);

  const [addMemBut,setAddMemBut]=useState(false);
  const [addExpBut,setAddExpBut]=useState(false);

  useEffect(()=>{
    const getMembers = async ()=>{
      const response=await axios.get(`/api/groups/${groupId}/members`);
      setMembers(response.data);
    }

    const getExpenses = async ()=>{
      const response = await axios.get(`/api/groups/${groupId}/expenses`);
      setExpenses(response.data);
    }

    const getBalance = async ()=>{
      const response = await axios.get(`/api/groups/${groupId}/balance`);
      setBalances(response.data);
    }

    getMembers();
    getExpenses();
    getBalance();
  },[userDetails,groupId]);

  return (
    <>
      <title>Group Details</title>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#D8D9CD] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1
              className="text-2xl text-[#16211C] font-['Fraunces']"
              style={{ fontWeight: 500 }}
            >
              {groupName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="px-4 py-2.5 bg-[#2F6F5E] hover:bg-[#265C4E] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150"
                    onClick={()=>{setAddMemBut(true);}}>
            Add Member
          </button>

          <button className="px-4 py-2.5 bg-[#16211C] hover:bg-[#22322A] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150"
                  onClick={()=>{setAddExpBut(true);}}>
            Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Left: Balances & Members */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3
              className="text-[16px] text-[#16211C] font-['Fraunces']"
              style={{ fontWeight: 500 }}
            >
              Balances
            </h3>
            <button className="text-[13px] text-[#2F6F5E] font-medium font-['Inter'] hover:underline">
              Settle up
            </button>
          </div>
          <p className="text-xs text-[#6B7268] mt-1 font-['Inter']">
            Who owes whom in this group.
          </p>

          <div className="mt-4 border-t border-[#D8D9CD]">
            {balances.length === 0 ? (
              <div className="py-6 text-[13px] text-[#8B9086] font-['Inter']">
                Everyone's settled up.
              </div>
            ) : (
              balances.map((transaction) => (
                <div
                  key={`${transaction.userId}-${transaction.oweToId}`}
                  className="flex items-center justify-between py-4 border-b border-[#D8D9CD]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EFF0E9] border border-[#D8D9CD] text-[#6B7268] flex items-center justify-center shrink-0">
                      <ArrowRight size={16} />
                    </div>
                    <div className="text-[14px] font-medium text-[#16211C] font-['Inter']">
                      {transaction.userId!=userDetails.id ? transaction.name : "You"}{" "}
                      <span className="font-normal text-[#6B7268]">owes</span>{" "}
                      {transaction.oweToId!=userDetails.id ? transaction.oweTo : "you"}
                    </div>
                  </div>
                  <div className="text-[15px] font-medium text-[#9C3D54] font-['Inter']">
                    ₹{transaction.amount}
                  </div>
                </div>
              ))
            )}
          </div>

          <h3
            className="text-[16px] text-[#16211C] font-['Fraunces'] mt-10"
            style={{ fontWeight: 500 }}
          >
            All Members
          </h3>
          <p className="text-xs text-[#6B7268] mt-1 font-['Inter']">
            Everyone in this group.
          </p>

          <div className="mt-4 border-t border-[#D8D9CD]">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 py-3 border-b border-[#D8D9CD]"
              >
                <div className="w-8 h-8 rounded-full bg-[#16211C] text-[#F6F7F1] flex items-center justify-center text-xs font-medium font-['Inter'] shrink-0">
                  {member.name[0]}
                </div>
                <div className="text-[14px] font-medium text-[#16211C] font-['Inter']">
                  {member.id === userDetails.id ? "You" : member.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Expenses list */}
        <div className="lg:col-span-3">
          <h3
            className="text-[16px] text-[#16211C] font-['Fraunces']"
            style={{ fontWeight: 500 }}
          >
            Expenses
          </h3>
          <p className="text-xs text-[#6B7268] mt-1 font-['Inter']">
            Everything logged in this group, most recent first.
          </p>

          <div className="mt-4 border-t border-[#D8D9CD]">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-4 border-b border-[#D8D9CD]"
              >
                <div>
                  <div className="text-[14px] font-medium text-[#16211C] font-['Inter']">
                    {expense.desrciption}
                  </div>
                  <div className="text-[12px] text-[#6B7268] font-['Inter']">
                    Paid by {expense.paidById!=userDetails.id?expense.paidBy.name:"you"} · {new Date(expense.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-[15px] font-medium text-[#16211C] font-['Inter']">
                  ₹{expense.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

{addMemBut &&
<div className="fixed inset-0 bg-[#16211C]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-[#F6F7F1] rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
    <div className="flex items-center justify-between mb-6">
      <h2
        className="text-xl text-[#16211C] font-['Fraunces']"
        style={{ fontWeight: 500 }}
      >
        Add Member
      </h2>
      <button className="text-[#6B7268] hover:text-[#16211C] transition-colors">
        <X size={20} onClick={()=>{setAddMemBut(false);}}/>
      </button>
    </div>
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Name
        </label>
        <input
          type="text"
          placeholder="e.g. Priya Sharma"
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="e.g. priya@example.com"
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
        />
      </div>
    </div>
    <div className="flex items-center justify-end gap-3 mt-8">
      <button className="px-4 py-2.5 text-sm font-medium font-['Inter'] text-[#6B7268] hover:text-[#16211C] transition-colors"
              onClick={()=>{setAddMemBut(false);}}>
        Cancel
      </button>
      <button className="px-5 py-2.5 bg-[#2F6F5E] hover:bg-[#265C4E] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150">
        Add Member
      </button>
    </div>
  </div>
</div>
}

{addExpBut &&
<div className="fixed inset-0 bg-[#16211C]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

  <div className="bg-[#F6F7F1] rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
  
    <div className="flex items-center justify-between mb-6">
      <h2
        className="text-xl text-[#16211C] font-['Fraunces']"
        style={{ fontWeight: 500 }}
      >
        Add Expense
      </h2>
      <button className="text-[#6B7268] hover:text-[#16211C] transition-colors">
        <X size={20} onClick={()=>{setAddExpBut(false);}}/>
      </button>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Description
        </label>
        <input
          type="text"
          placeholder="e.g. Dinner at Cafe"
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8B9086] font-['Inter']">
            ₹
          </span>
          <input
            type="number"
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Paid By
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
          >
            <option>You</option>
            {members.map((member)=>{
              if(member.id===userDetails.id){
                return null;
              }
              else{
                return <option>{member.name}</option>
              }
            })}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7268] pointer-events-none"
          />
        </div>
      </div>
    </div>

    <div className="flex items-center justify-end gap-3 mt-8">
      <button className="px-4 py-2.5 text-sm font-medium font-['Inter'] text-[#6B7268] hover:text-[#16211C] transition-colors"
                onClick={()=>{setAddExpBut(false);}}>
        Cancel
      </button>
      <button className="px-5 py-2.5 bg-[#16211C] hover:bg-[#22322A] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150">
        Add Expense
      </button>
    </div>
  </div>
</div>
}
    </>
  );
}