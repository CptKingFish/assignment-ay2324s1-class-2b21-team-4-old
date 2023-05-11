import React from "react";
import { useRouter } from "next/router";
import Tasks from "@/components/Tasks";
import Backlog from "@/components/Backlog";
import AllTasks from "@/components/AllTasks";

const Scrum = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(0);
  const { id } = router.query;
  return (
    <div className="h-full w-full bg-white">
      <div className="mx-auto p-8 md:max-w-5xl">
        <div className="flex items-center gap-4">
          <h2 className="font-bold">Project Swifty </h2>
          <button className="btn-error btn-sm btn">Reset Sprint</button>
        </div>
        <div className="flex items-center gap-4">
          <h5 className="whitespace-nowrap">Day 4 / 14</h5>
          <progress
            className="progress h-4 w-full rounded-full"
            value={(4 / 14) * 100}
            max="100"
          ></progress>
        </div>
        <div className="tabs mt-6">
          <a
            onClick={() => setActiveTab(0)}
            className={`tab-lifted tab ${activeTab === 0 ? "tab-active" : ""}`}
          >
            Tasks
          </a>
          <a
            onClick={() => setActiveTab(1)}
            className={`tab-lifted tab ${activeTab === 1 ? "tab-active" : ""}`}
          >
            Backlog
          </a>
          <a
            onClick={() => setActiveTab(2)}
            className={`tab-lifted tab ${activeTab === 2 ? "tab-active" : ""}`}
          >
            All Tasks
          </a>
        </div>
        {activeTab === 0 && <Tasks />}
        {activeTab === 1 && <Backlog />}
        {activeTab === 2 && <AllTasks />}
      </div>
    </div>
  );
};

export default Scrum;
