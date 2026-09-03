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

  const [nameInp,setNameInp]=useState("");
  const [emailInp,setEmailInp]=useState("");

  const [desc,setDesc]=useState("");
  const [amnt,setAmnt]=useState("");
  const [paidBy,setPaidBy]=useState(userDetails.id);

  const [isInvolvedOpen,setIsInvolvedOpen]=useState(false);
  const [involvedMembers,setInvolvedMembers]=useState<number[]>([]);

  useEffect(()=>{
    const getMembers = async ()=>{
      const response=await axios.get(`/api/groups/${groupId}/members`);
      setMembers(response.data);
    }
    getMembers();
  },[addMemBut,groupId]);

  useEffect(()=>{
    const getExpenses = async ()=>{
      const response = await axios.get(`/api/groups/${groupId}/expenses`);
      setExpenses(response.data);
    }
    getExpenses();
  },[addExpBut,groupId]);

  useEffect(()=>{
    const getBalance = async ()=>{
      const response = await axios.get(`/api/groups/${groupId}/balance`);
      setBalances(response.data);
    }
    getBalance();
  },[addExpBut,groupId]);

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
                      <span className="font-normal text-[#6B7268]">{transaction.userId!=userDetails.id ? "owes" : "owe"}{" "}</span>{" "}
                      {transaction.oweToId!=userDetails.id ? transaction.oweTo : "You"}
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
        <X size={20} onClick={()=>{
          setAddMemBut(false);
          setNameInp("");
          setEmailInp("");
          }}/>
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
          value={nameInp}
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
          onChange={(event)=>{setNameInp(event.target.value);}}
          onKeyDown={async (event)=>{
            if(event.key==="Enter"){
              if(emailInp!="" && nameInp!=""){
                const response= await axios.post(`/api/groups/${groupId}/members`,
                  {
                    emailId: emailInp.toLowerCase()
                  }
                );
                setMembers([...members,response.data.user]);
                setAddMemBut(false);
              }
            }
          }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="e.g. priya@example.com"
          value={emailInp}
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
          onChange={(event)=>{setEmailInp(event.target.value);}}
          onKeyDown={async (event)=>{
            if(event.key==="Enter"){
              if(emailInp!="" && nameInp!=""){
                const response= await axios.post(`/api/groups/${groupId}/members`,
                  {
                    emailId: emailInp.toLowerCase()
                  }
                );
                setMembers([...members,response.data.user]);
                setAddMemBut(false);
                setNameInp("");
                setEmailInp("");
              }
            }
          }}
        />
      </div>
    </div>
    <div className="flex items-center justify-end gap-3 mt-8">
      <button className="px-4 py-2.5 text-sm font-medium font-['Inter'] text-[#6B7268] hover:text-[#16211C] transition-colors"
              onClick={()=>{
                setAddMemBut(false);
                setNameInp("");
                setEmailInp("");
                }}>
        Cancel
      </button>
      <button className="px-5 py-2.5 bg-[#2F6F5E] hover:bg-[#265C4E] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150"
      onClick={async ()=>{
        const response= await axios.post(`/api/groups/${groupId}/members`,
          {
            emailId: emailInp.toLowerCase()
          }
        );
        setMembers([...members,response.data.user]);
        setAddMemBut(false);
        setNameInp("");
        setEmailInp("");
      }
      }>
        Add Member
      </button>
    </div>
  </div>
</div>
}

{addExpBut &&
<div className="fixed inset-0 bg-[#16211C]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
>

  <div className="bg-[#F6F7F1] rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
  
    <div className="flex items-center justify-between mb-6">
      <h2
        className="text-xl text-[#16211C] font-['Fraunces']"
        style={{ fontWeight: 500 }}
      >
        Add Expense
      </h2>
      <button className="text-[#6B7268] hover:text-[#16211C] transition-colors">
        <X size={20} onClick={()=>{
          setAddExpBut(false);
          setAddExpBut(false);
          setDesc("");
          setAmnt("");
          setInvolvedMembers([]);
          setPaidBy(userDetails.id);
          }}/>
      </button>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Description
        </label>
        <input
          type="text"
          value={desc}
          placeholder="e.g. Dinner at Cafe"
          className="w-full px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
          onChange={(event)=>{setDesc(event.target.value);}}
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
            value={amnt}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] placeholder:text-[#8B9086] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
            onChange={(event)=>{setAmnt(event.target.value);}}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5">
          Paid By
        </label>
        <div className="relative">
          <select
            value={paidBy}
            className="w-full appearance-none px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
            onChange={(event)=>{setPaidBy(Number(event.target.value));}}
          >
            <option value={userDetails.id}>You</option>
            {members.map((member)=>{
              if(member.id===userDetails.id){
                return null;
              }
              else{
                return <option value={member.id}>{member.name}</option>
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
    {/* Split Between (multi-select dropdown) */}
<div className="relative">
  <label className="block text-xs font-medium text-[#6B7268] font-['Inter'] mb-1.5 mt-3.5">
    Split Between
  </label>

  {/* Dropdown trigger button */}
  <button
    type="button"
    onClick={() => setIsInvolvedOpen(!isInvolvedOpen)}
    className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#D8D9CD] rounded-xl text-[14px] text-[#16211C] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/30 focus:border-[#2F6F5E]"
  >
    <span className="text-[#8B9086]">Select members</span>
    <ChevronDown size={16} className="text-[#6B7268]" />
  </button>

  {/* Dropdown panel — toggle visibility with state later */}
  { isInvolvedOpen &&
  <div className="absolute z-10 mt-1.5 w-full bg-white border border-[#D8D9CD] rounded-xl shadow-lg max-h-56 overflow-y-auto">
    {/* Repeat this block for each group member */}
    {
      members.map((member)=>{
        return (
    <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#EFF0E9] cursor-pointer transition-colors" key={member.id}>
      <input
        type="checkbox"
        checked={involvedMembers.includes(member.id)}
        className="w-4 h-4 rounded border-[#D8D9CD] text-[#2F6F5E] focus:ring-[#2F6F5E]/30 focus:ring-offset-0 accent-[#2F6F5E]"
        onChange={()=>{
          setInvolvedMembers((prev)=>{
            return prev.includes(member.id)? prev.filter((id)=>id!=member.id) : [...prev,member.id]
          })
        }}
      />
      <span className="text-[14px] text-[#16211C] font-['Inter']">
        {member.name}
      </span>
    </label>
        )
      })
    }
  </div>
}
</div>
    <div className="flex items-center justify-end gap-3 mt-8">
      <button className="px-4 py-2.5 text-sm font-medium font-['Inter'] text-[#6B7268] hover:text-[#16211C] transition-colors"
                onClick={()=>{
                  setAddExpBut(false);
                  setDesc("");
                  setAmnt("");
                  setInvolvedMembers([]);
                  setPaidBy(userDetails.id);
                  }}>
        Cancel
      </button>
      <button className="px-5 py-2.5 bg-[#16211C] hover:bg-[#22322A] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150"
              onClick={async ()=>{

                await axios.post(`/api/expenses`,{
                  description: desc,
                  amount:Number(amnt),
                  groupId:Number(groupId),
                  paidById:paidBy,
                  memberIds:involvedMembers
                });

                setAddExpBut(false);
                setDesc("");
                setAmnt("");
                setInvolvedMembers([]);
                setPaidBy(userDetails.id);
              }}>
        Add Expense
      </button>
    </div>
  </div>
</div>
}
    </>
  );
}