import React from "react";
import { useRouter } from "next/router";
import Login from "@/components/Login";
import Register from "@/components/Register";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  AbsoluteCenter,
} from "@chakra-ui/react";

const Authenticate = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(0);
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
      <AbsoluteCenter>
        <Tabs variant="enclosed" index={activeTab} onChange={handleTabChange}>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AbsoluteCenter>
    </>
  );
};

export default Authenticate;
