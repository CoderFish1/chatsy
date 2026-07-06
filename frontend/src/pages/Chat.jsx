import { ChatState } from "@/context/ChatProvider";
import SideDrawer from "@/components/miscellaneous/SideDrawer";
import MyChats from "@/components/miscellaneous/MyChats";
import ChatBox from "@/components/miscellaneous/ChatBox";
import { Box, Grid, GridItem } from "@chakra-ui/react";

const Chat = () => {
  const { user } = ChatState();

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
            <GridItem h="100%" minH={0} overflow="hidden">
              <MyChats />
            </GridItem>

            <GridItem h="100%" minH={0} overflow="hidden">
              <ChatBox />
            </GridItem>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Chat;
