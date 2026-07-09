import logo from "/photos/logo.jpg";
export default function Header() {
  return (
    <header className="flex h-[70px] items-center gap-4 border-b border-slate-200 bg-white px-6 font-sans">
      <div className="flex-shrink-0">
        <img className="h-10 block" src={logo} alt="website logo" />
      </div>

      <div className="text-2xl font-bold text-slate-900">
        <span>Split The Bill</span>
      </div>

      <div className="ml-auto">
        <button className="h-10 w-[100px] rounded-md border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:text-slate-800 active:scale-95">
          Logout
        </button>
      </div>
    </header>
  );
}
