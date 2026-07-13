export default function GroupDetails() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🏢</span>
            <h1 className="text-2xl font-bold text-slate-900">
              Apartment Split
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Active monthly utility bills and household grocery logs.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Add Member Button (Secondary Style) */}
          <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-sm transition-colors active:scale-95 duration-150">
            Add Member
          </button>

          <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors active:scale-95 duration-150">
            Add Expense
          </button>
        </div>
      </div>
    </>
  );
}
