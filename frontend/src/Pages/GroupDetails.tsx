export default function GroupDetails() {
  const members = [
    { id: 1, name: "John Doe", initials: "JD", amount: 45.0 },
    { id: 2, name: "Alex Smith", initials: "AS", amount: -12.5 },
    { id: 3, name: "You", initials: "YO", amount: -32.5 },
  ];

  const expenses = [
    {
      id: 1,
      description: "Electricity Bill",
      paidBy: "John Doe",
      amount: 90.0,
      date: "Sep 1, 2026",
    },
    {
      id: 2,
      description: "Groceries",
      paidBy: "You",
      amount: 54.0,
      date: "Aug 27, 2026",
    },
    {
      id: 3,
      description: "Internet",
      paidBy: "Alex Smith",
      amount: 40.0,
      date: "Aug 20, 2026",
    },
  ];

  return (
    <>
      <title>Group Details</title>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#D8D9CD] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🏢</span>
            <h1
              className="text-2xl text-[#16211C] font-['Fraunces']"
              style={{ fontWeight: 500 }}
            >
              Apartment Split
            </h1>
          </div>
          <p className="text-sm text-[#6B7268] font-['Inter']">
            Active monthly utility bills and household grocery logs.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="px-4 py-2.5 bg-[#2F6F5E] hover:bg-[#265C4E] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150">
            Add Member
          </button>

          <button className="px-4 py-2.5 bg-[#16211C] hover:bg-[#22322A] text-[#F6F7F1] text-sm font-medium font-['Inter'] rounded-full transition-colors active:scale-95 duration-150">
            Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Left: Members & balances */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3
              className="text-[16px] text-[#16211C] font-['Fraunces']"
              style={{ fontWeight: 500 }}
            >
              Members
            </h3>
            <button className="text-[13px] text-[#2F6F5E] font-medium font-['Inter'] hover:underline">
              Settle up
            </button>
          </div>
          <p className="text-xs text-[#6B7268] mt-1 font-['Inter']">
            Net balance for each person in this group.
          </p>

          <div className="mt-4 border-t border-[#D8D9CD]">
            {members.map((member) => {
              const positive = member.amount > 0;
              const settled = member.amount === 0;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-4 border-b border-[#D8D9CD]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#16211C] text-[#F6F7F1] flex items-center justify-center text-xs font-medium font-['Inter']">
                      {member.initials}
                    </div>
                    <div className="text-[14px] font-medium text-[#16211C] font-['Inter']">
                      {member.name}
                    </div>
                  </div>
                  <div className="text-right">
                    {settled ? (
                      <div className="text-[13px] text-[#6B7268] font-['Inter']">
                        settled
                      </div>
                    ) : (
                      <>
                        <div className="text-[12px] text-[#6B7268] font-['Inter']">
                          {positive ? "owed to them" : "they owe"}
                        </div>
                        <div
                          className={`text-[15px] font-medium font-['Inter'] ${
                            positive ? "text-[#2F6F5E]" : "text-[#9C3D54]"
                          }`}
                        >
                          ${Math.abs(member.amount).toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
                    {expense.description}
                  </div>
                  <div className="text-[12px] text-[#6B7268] font-['Inter']">
                    Paid by {expense.paidBy} · {expense.date}
                  </div>
                </div>
                <div className="text-[15px] font-medium text-[#16211C] font-['Inter']">
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}