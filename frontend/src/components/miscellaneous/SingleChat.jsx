import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  Flex,
  IconButton,
  Input,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import io from "socket.io-client";
import { Send, ArrowLeft, Settings, Users } from "lucide-react"; // Removed 'Divide' as it wasn't used
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderPic } from "../../config/ChatLogics";
import ProfileModalBox from "./ProfileModalBox";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import { toaster } from "../ui/toaster";
import axios from "axios";
import TypingIndicator from "./TypingIndicator";
import { API_URL } from "../../config/api";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef();
  const selectedChatCompare = useRef();

  useEffect(() => {
    if (!user) return;

    socket.current = io(API_URL);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setsocketConnected(true));

    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );

      setMessages(data);
      setLoading(false);

      socket.current?.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare.current = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

 useEffect(() => {
   if (!socket.current) return;

  const handleMessageReceived = (newMessageReceived) => {
    if (
      !selectedChatCompare.current ||
      selectedChatCompare.current._id !== newMessageReceived.chat._id
    ) {
      setNotification((prevNotification) => {
        const existingIndex = prevNotification.findIndex(
          (n) => n.chat._id === newMessageReceived.chat._id,
        );

        if (existingIndex !== -1) {
          // Same chat already has a notification — update it, don't stack
          const updated = [...prevNotification];
          updated[existingIndex] = {
            ...newMessageReceived,
            count: (updated[existingIndex].count || 1) + 1,
          };
          // move it to the top
          const [moved] = updated.splice(existingIndex, 1);
          return [moved, ...updated];
        }

        // New chat — add fresh entry
        return [{ ...newMessageReceived, count: 1 }, ...prevNotification];
      });

      setFetchAgain((prev) => !prev);
    } else {
      setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    }
  };

   socket.current.on("message received", handleMessageReceived);

   return () => {
     socket.current?.off("message received", handleMessageReceived);
   };
 }, []);

  const handleSendMessage = async () => {
    if (!newMessage) return;

    // FIX: Add .current to socket
    socket.current.emit("stop typing", selectedChat._id);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const messageToSend = newMessage;
      setNewMessage("");

      const { data } = await axios.post(
        "/api/message",
        {
          content: messageToSend,
          chatId: selectedChat._id,
        },
        config,
      );

      // FIX: Standardize event name to "new message"
      socket.current.emit("new message", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to send the Message",
        type: "error",
        duration: 3000,
      });
    }
  };

 const handleKeyDown = (e) => {
   if (e.key === "Enter" && !e.shiftKey) {
     e.preventDefault();
     handleSendMessage();
   }
 };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      // FIX: Add .current to socket
      socket.current.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3500;

    setTimeout(() => {
      var TimeNow = new Date().getTime();
      var timeDiff = TimeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        // FIX: Match the backend event name and add .current
        socket.current.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };


  return (
    <>
      {selectedChat ? (
        <Flex flexDir="column" h="100%" w="100%">
          {/* ---- HEADER ---- */}
          <Flex
            pb={3}
            mb={3}
            borderBottom="1px solid rgba(255, 255, 255, 0.1)"
            align="center"
            justify="space-between"
            w="100%"
          >
            <Flex align="center" gap={2}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={() => setSelectedChat("")}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </IconButton>

              {!selectedChat.isGroup ? (
                <>
                  <Image
                    src={
                      getSenderPic(user, selectedChat.users) ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        getSender(user, selectedChat.users),
                      )}&background=random&color=fff`
                    }
                    boxSize="36px"
                    borderRadius="full"
                    objectFit="cover"
                    border="1px solid rgba(255,255,255,0.15)"
                    alt={getSender(user, selectedChat.users)}
                  />
                  <Text fontSize="xl" fontWeight="600" letterSpacing="wide">
                    {getSender(user, selectedChat.users)}
                  </Text>
                  <ProfileModalBox
                    user={selectedChat.users.find((u) => u._id !== user._id)}
                  />
                </>
              ) : (
                <>
                  <Box
                    boxSize="36px"
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    border="1px solid rgba(255,255,255,0.15)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Users size={18} color="white" />
                  </Box>
                  <Text fontSize="xl" fontWeight="600" letterSpacing="wide">
                    {selectedChat.chatName.toUpperCase()}
                  </Text>
                </>
              )}
            </Flex>

            {selectedChat.isGroup && (
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              >
                <IconButton
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  aria-label="Group Settings"
                >
                  <Settings size={20} />
                </IconButton>
              </UpdateGroupChatModal>
            )}
          </Flex>

          {/* ---- MESSAGES & INPUT AREA ---- */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="rgba(0, 0, 0, 0.2)"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={16}
                h={16}
                alignSelf="center"
                margin="auto"
                color="whiteAlpha.700"
                thickness="4px"
              />
            ) : messages.length === 0 ? (
              <Flex
                flexDir="column"
                justify="center"
                align="center"
                h="100%"
                gap={2}
                color="whiteAlpha.500"
              >
                <Text fontSize="3xl">👋</Text>
                <Text fontSize="md" fontWeight="500">
                  {selectedChat.isGroup
                    ? `Say hi to everyone in ${selectedChat.chatName}!`
                    : `Say hi to ${getSender(user, selectedChat.users)}!`}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.400">
                  No messages yet — start the conversation.
                </Text>
                <Text
                  color="whiteAlpha.400"
                  fontSize="sm"
                  mt={10}
                  fontWeight="500"
                >
                  Designed & Built by Shrey
                </Text>
              </Flex>
            ) : (
              <Flex flexDir="column" overflowY="auto" h="100%" pb={2}>
                <ScrollableChat messages={messages} />
              </Flex>
            )}

            <Box mt={3} position="relative" display="flex" alignItems="center">
              {/* Floating Typing Indicator */}
              {isTyping && (
                <Box
                  position="absolute"
                  bottom="100%"
                  left="0"
                  mb={1}
                  pointerEvents="none"
                  zIndex={3}
                >
                  <TypingIndicator />
                </Box>
              )}

              {/* Main Input */}
              <Textarea
                onKeyDown={handleKeyDown}
                onChange={typingHandler}
                value={newMessage}
                variant="filled"
                bg="rgba(255, 255, 255, 0.05)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                _hover={{ bg: "rgba(255, 255, 255, 0.08)" }}
                _focus={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "blue.400",
                }}
                color="white"
                placeholder="Type a message..."
                pr="3rem"
                resize="none"
                rows={1}
                overflow="hidden"
                minH="40px"
                maxH="120px"
              />

              {/* Send Button */}
              <IconButton
                position="absolute"
                right="8px"
                size="sm"
                variant="ghost"
                color="whiteAlpha.700"
                _hover={{ bg: "whiteAlpha.200", color: "white" }}
                onClick={handleSendMessage}
                aria-label="Send message"
                zIndex={2}
                disabled={!newMessage}
              >
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>
        </Flex>
      ) : (
        <Flex h="100%" w="100%" justify="center" align="center" px={8}>
          <Flex direction="column" align="center" gap={4} textAlign="center">
            <Box
              boxSize="72px"
              borderRadius="full"
              bg="rgba(255,255,255,0.04)"
              border="1px solid rgba(255,255,255,0.08)"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Users size={30} color="#A0AEC0" />
            </Box>
            <Text fontSize="2xl" fontWeight="700" color="white">
              No Conversation Selected
            </Text>
            <Text color="whiteAlpha.600" fontSize="md">
              Choose a conversation from the sidebar to start chatting.
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;
