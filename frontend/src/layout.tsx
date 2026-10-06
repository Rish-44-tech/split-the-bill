import { Outlet } from "react-router";
import Header from "./Components/Header";
import "./index.css";

export default function Layout({
  userDetails,groups,getGroups
}: {
  userDetails: { id:number; name: string; email: string },
  groups :{id:number, name: string, createdAt:Date}[],
  getGroups: ()=>Promise<void>
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F6F7F1]">
      <Header userDetails={userDetails} groups={groups} getGroups={getGroups}/>

      <main className="flex-1 h-full overflow-y-auto p-8">
        <Outlet context={[userDetails,groups,getGroups]}/>
      </main>
    </div>
  );
}