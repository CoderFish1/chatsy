import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  IconButton,
  Input,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { Send } from "lucide-react";
import { ArrowLeft, Settings, Users } from "lucide-react";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderPic } from "../../config/ChatLogics";
import ProfileModalBox from "./ProfileModalBox";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import { toaster } from "../ui/toaster"; // Make sure this path is correct for your setup
import axios from "axios";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // core function that actually sends the data
  const handleSendMessage = async () => {
    if (!newMessage) return; // Don't send empty messages

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Clear input immediately for better UX
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

      setMessages([...messages, data]);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to send the Message",
        type: "error",
        duration: 3000,
      });
    }
  };

  //  The Keyboard Trigger
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents default form submission behavior if applicable
      handleSendMessage();
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // TODO: typing indicator logic
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
            ) : (
              <Flex flexDir="column" overflowY="auto" h="100%" pb={2}>
                <ScrollableChat messages={messages} />
              </Flex>
            )}

            {/* ---- INPUT FIELD ---- */}
            <Box mt={3} position="relative" display="flex" alignItems="center">
              <Input
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
              />
              {/* Adds padding on the right so text doesn't hide behind the button */}

              {/* The Send Button */}
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
                {/* Triggered by mouse click */}
                {/* Disables the button if input is empty */}
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>
        </Flex>
      ) : (
        <Flex h="100%" w="100%" justify="center" align="center" px={8}>
          {/* Empty State remains the same */}
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
