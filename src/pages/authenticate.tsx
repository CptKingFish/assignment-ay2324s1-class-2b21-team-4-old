
import React from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import Login from "@/components/Login";
import Register from "@/components/Register";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

const Authenticate = () => {
  const router = useRouter();
  const { auth } = useGlobalContext();
  const [activeTab, setActiveTab] = React.useState(0);
  const { message, type } = router.query;

  if (auth) {
    router.push("/home").catch((err) => console.error(err));
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  React.useEffect(() => {
    if (!message || !type) return;
    if (message && type == "SUCCESS") {
        console.log(message)
    } else if (message && type == "BAD_REQUEST") {
        console.error()
    }
  }, [message, type]);

  return (
    <>
      <Box maxW="md" mx="auto">
      <Tabs isFitted colorScheme="blue" onChange={handleTabChange}>
        <TabList mb="1em">
          <Tab
            _selected={{ color: "white", bg: "blue.500" }}
          >
            Login
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "blue.500" }}
          >
            Register
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {activeTab === 0 && <Login />}
          </TabPanel>
          <TabPanel>
            {activeTab === 1 && <Register />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
    </>
  );
};

export default Authenticate;
