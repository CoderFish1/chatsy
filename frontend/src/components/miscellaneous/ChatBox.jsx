import React from "react";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  return (
    <Box
      display="flex"
      flexDir="column"
      bg="rgba(15, 15, 15, 0.95)"
      backdropFilter="blur(12px)"
      color="white"
      borderRadius="xl"
      border="1px solid rgba(255, 255, 255, 0.1)"
      h="100%"
      w="100%"
      p={4}
      fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
