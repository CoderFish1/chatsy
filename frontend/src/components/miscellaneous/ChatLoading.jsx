import React from "react";
import { Stack, Box, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack gap="4" mt="2">
      {Array.from({ length: 8 }).map((_, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          gap="4"
          p="2"
          borderRadius="lg"
          bg="rgba(255, 255, 255, 0.03)"
        >
          {/* Circular Skeleton for Avatar */}
          <Skeleton
            width="45px"
            height="45px"
            borderRadius="full"
            variant="shine"
            style={{ animationDuration: "2s" }} // Forces exactly 2 seconds
          />

          {/* Stack for Name and Email/Message */}
          <Stack gap="2" flex="1">
            <Skeleton
              height="16px"
              width="40%"
              variant="shine"
              borderRadius="sm"
              style={{ animationDuration: "2s" }} // Forces exactly 2 seconds
            />
            <Skeleton
              height="12px"
              width="70%"
              variant="shine"
              borderRadius="sm"
              style={{ animationDuration: "2s" }} // Forces exactly 2 seconds
            />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default ChatLoading;
