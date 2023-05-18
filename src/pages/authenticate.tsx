import React from "react";
import { useRouter } from "next/router";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { useGlobalContext } from "@/context";

const Authenticate = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(0);
  const { user } = useGlobalContext();
  // React.useEffect(() => {
  //   if (!user) return;
  //   router.push("/chat").catch(console.error);
  // }, [user, router]);
  const { message, type } = router.query;

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  React.useEffect(() => {
    if (!message || !type) return;
    if (message && type == "SUCCESS") {
      console.log(message);
    } else if (message && type == "BAD_REQUEST") {
      console.error();
    }
  }, [message, type]);

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content w-1/2 flex-col lg:flex-row-reverse">
          <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
            <div className="card-body">
              <div className="tabs">
                <a
                  className={
                    "tab-bordered tab" + (activeTab == 0 ? " tab-active" : "")
                  }
                  onClick={() => handleTabChange(0)}
                >
                  Login
                </a>
                <a
                  className={
                    "tab-bordered tab" + (activeTab == 1 ? " tab-active" : "")
                  }
                  onClick={() => handleTabChange(1)}
                >
                  Register
                </a>
              </div>
              {activeTab == 0 ? <Login /> : <Register />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authenticate;
