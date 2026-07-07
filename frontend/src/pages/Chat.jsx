import React, { useState } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { ChatState } from "@/context/ChatProvider";
import SideDrawer from "@/components/miscellaneous/SideDrawer";
import MyChats from "@/components/miscellaneous/MyChats";
import ChatBox from "@/components/miscellaneous/ChatBox";

const Chat = () => {
  const { user, selectedChat } = ChatState(); // Pulled selectedChat for mobile logic
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Box w="100vw" h="100vh" overflow="hidden">
      {user && <SideDrawer />}

      {user && (
        <Box
          h={{ base: "calc(100vh - 60px)", md: "calc(100vh - 70px)" }}
          p={{ base: 2, md: 4 }}
        >
          <Grid
            h="100%"
            templateColumns={{
              base: "1fr",
              md: "340px 1fr",
            }}
            gap={{ base: 2, md: 4 }}
          >
            {/* Show MyChats ONLY on mobile if no chat is selected. Always show on Desktop. */}
            <GridItem
              h="100%"
              minH={0}
              overflow="hidden"
              display={{ base: selectedChat ? "none" : "block", md: "block" }}
            >
              <MyChats fetchAgain={fetchAgain} />
            </GridItem>

            {/* Show ChatBox ONLY on mobile if a chat IS selected. Always show on Desktop. */}
            <GridItem
              h="100%"
              minH={0}
              overflow="hidden"
              display={{ base: selectedChat ? "block" : "none", md: "block" }}
            >
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </GridItem>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Chat;
