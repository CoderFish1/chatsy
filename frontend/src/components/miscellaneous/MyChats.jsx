import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Text, Image } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { toaster } from "../ui/toaster";
import { getSender, getSenderPic } from "../../config/ChatLogics";
import ChatLoading from "./ChatLoading";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);

      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error fetching chats",
        description: "Failed to load chats",
        type: "error",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [user]);

  return (
    <Box
      display={{
        base: selectedChat ? "none" : "flex",
        md: "flex",
      }}
      flexDir="column"
      bg="rgba(15, 15, 15, 0.95)"
      backdropFilter="blur(12px)"
      color="white"
      borderRadius="xl"
      border="1px solid rgba(255, 255, 255, 0.1)"
      h="100%"
      maxH="100%"
      p={4}
      overflow="hidden"
      fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pb={4}
        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      >
        <Text fontSize="2xl" fontWeight="600" letterSpacing="wide">
          My Chats
        </Text>

        <Button
          size="sm"
          variant="ghost"
          color="white"
          border="1px solid rgba(255, 255, 255, 0.15)"
          _hover={{
            bg: "whiteAlpha.200",
          }}
        >
          <Plus size={16} />
          <Text
            display={{
              base: "none",
              lg: "block",
            }}
            ml={2}
            fontWeight="500"
          >
            New Group
          </Text>
        </Button>
      </Box>

      {/* Chat List */}
      <Box mt={4} flex={1} minH={0}>
        {chats ? (
          <Stack
            h="100%"
            overflowY="auto"
            gap={2}
            pr={2}
            css={{
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
              },
            }}
          >
            {chats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const senderPic = !chat.isGroup
                ? getSenderPic(loggedUser, chat.users)
                : null;
              const chatName = !chat.isGroup
                ? getSender(loggedUser, chat.users)
                : chat.chatName;

              return (
                <Box
                  key={chat._id}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={3}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent"}
                  border={
                    isSelected
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "1px solid transparent"
                  }
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.06)",
                  }}
                  transition="all 0.15s ease-in-out"
                  onClick={() => setSelectedChat(chat)}
                >
                  <Image
                    src={
                      senderPic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        chatName || "Chat",
                      )}&background=random&color=fff`
                    }
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        chatName || "Chat",
                      )}&background=random&color=fff`;
                    }}
                    alt={chatName}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    flexShrink={0}
                  />
                  <Text fontWeight="500" fontSize="sm" noOfLines={1}>
                    {chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
