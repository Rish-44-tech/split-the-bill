import { Outlet } from "react-router";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

export default function Layout({
  userDetails,groups,getGroups
}: {
  userDetails: { id:number; name: string; email: string },
  groups :{id:number, name: string, createdAt:Date}[],
  getGroups: ()=>Promise<void>
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Header />
      <div className="flex flex-row flex-1 overflow-hidden w-full">
        <Sidebar userDetails={userDetails} groups={groups} />

        <main className="flex-1 h-full overflow-y-auto p-8 bg-slate-50/50">
          <Outlet context={[userDetails,groups,getGroups]}/>
        </main>
      </div>
    </div>
  );
}
