import React from "react";
import { useRouter } from "next/router";
import ActiveTasks from "@/components/ActiveTasks";
import Backlog from "@/components/Backlog";
import ProjectFiles from "@/components/ProjectFiles";
import { api } from "@/utils/api";
import useLogger from "@/hooks/useChangeLog";

const Scrum = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(0);
  const { data: users } = api.user.getAllUsersByChatId.useQuery(
    { chat_id: router.query.id as string },
    { enabled: !!router.query.id }
  );
  const { data: scrum, isLoading } = api.scrum.getScrumByChatId.useQuery(
    {
      chat_id: router.query.id as string | null,
    },
    {
      enabled: !!router.query.id,
    }
  );
  if (!isLoading && !scrum) {
    router.push("/chat").catch(console.error);
  }
  useLogger(scrum, "scrum");
  return (
    <div className="relative h-full w-full bg-white">
      <div className="mx-auto p-8 md:max-w-5xl">
        <div className="flex items-center gap-4">
          <h2 className="font-bold">Project Swifty </h2>
          {/* <button className="btn-error btn-sm btn">Reset Sprint</button> */}
        </div>
        {/* <div className="flex items-center gap-4">
          <h5 className="whitespace-nowrap">Day 4 / 14</h5>
          <progress
            className="progress h-4 w-full rounded-full"
            value={(4 / 14) * 100}
            max="100"
          ></progress>
        </div> */}
        <div className="tabs mt-6">
          <a
            onClick={() => setActiveTab(0)}
            className={`tab-lifted tab ${activeTab === 0 ? "tab-active" : ""}`}
          >
            Active Tasks
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
            Project Files
          </a>
        </div>
        {activeTab === 0 && <ActiveTasks users={users || []} scrum={scrum} />}
        {activeTab === 1 && <Backlog scrum={scrum} users={users || []} />}
        {activeTab === 2 && (
          <ProjectFiles
            scrum_id={scrum ? scrum._id : ""}
            scrum_files={scrum ? scrum.files : []}
          />
        )}
      </div>
    </div>
  );
};

export default Scrum;
