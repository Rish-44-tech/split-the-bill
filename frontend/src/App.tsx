import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import axios from "axios";
import Dashboard from "./Pages/Dashboard";
import Activity from "./Pages/Activity";
import NotFound from "./Pages/NotFound";
import GroupDetails from "./Pages/GroupDetails";
import Layout from "./layout";
import "./App.css";

function App() {
  const [groups, setGroups] = useState([]);
  const userDetails = { id: 7, name: "John Doe", email: "john@gmail.com" };

  const getGroups = async () => {
    const response = await axios.get("/api/groups?userId=7", {
      data: {
        userId: 6,
      },
    });
    setGroups(response.data);
  };
  useEffect(() => {
    const setGroupDetails = async () => {
      await getGroups();
    };
    setGroupDetails();
  }, []);

  return (
    <>
      <Routes>
        <Route element={<Layout userDetails={userDetails} groups={groups} getGroups={getGroups}></Layout>}>
          <Route path="/" element={<Dashboard />}></Route>

          <Route path="/dashboard" element={<Dashboard />}></Route>

          <Route path="/activity" element={<Activity />}></Route>

          <Route
            path="/group/:groupId"
            element={<GroupDetails></GroupDetails>}
          ></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
