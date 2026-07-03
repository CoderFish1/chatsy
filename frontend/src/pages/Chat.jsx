import { ChatState } from "@/context/ChatProvider";
import SideDrawer from "@/components/miscellaneous/SideDrawer";
import MyChats from "@/components/miscellaneous/MyChats";
import ChatBox from "@/components/miscellaneous/ChatBox";
import { Box } from "@chakra-ui/react"

const Chat = () => {

  const {user} = ChatState()
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh" // Ensure the container has height
        p="10px"
      >
        {user && (
          <Box w="30%">
            {" "}
            {/* Define width here */}
            <MyChats />
          </Box>
        )}
        {user && (
          <Box w="68%">
            {" "}
            {/* Define width here */}
            <ChatBox />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Chat;

//restarting today after long break
