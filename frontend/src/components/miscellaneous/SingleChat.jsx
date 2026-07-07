import React from "react";
import { Box, Text, Flex, IconButton, Input, Image } from "@chakra-ui/react";
import { ArrowLeft, Settings, Users } from "lucide-react";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderPic } from "../../config/ChatLogics";
import ProfileModalBox from "./ProfileModalBox";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

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
            {/* LEFT SIDE: Back Button + Pic + Chat Name */}
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
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        getSender(user, selectedChat.users),
                      )}&background=random&color=fff`;
                    }}
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

            {/* RIGHT SIDE: Group Settings Icon */}
            {selectedChat.isGroup && (
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
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

          {/* ---- MESSAGES AREA ---- */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="rgba(0, 0, 0, 0.2)"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            <Flex flexDir="column" overflowY="auto" h="100%">
              <Text color="whiteAlpha.500" textAlign="center" mt={5}>
                Start of your conversation
              </Text>
            </Flex>

            {/* ---- INPUT FIELD ---- */}
            <Box mt={3}>
              <Input
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
              />
            </Box>
          </Box>
                </Flex>
      ) : (
        /* ---------------- EMPTY STATE ---------------- */
        <Flex
          h="100%"
          w="100%"
          justify="center"
          align="center"
          px={8}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap={4}
            textAlign="center"
          >
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

            <Text
              fontSize="2xl"
              fontWeight="700"
              color="white"
              fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            >
              No Conversation Selected
            </Text>

            <Text
              color="whiteAlpha.600"
              maxW="400px"
              fontSize="md"
              lineHeight="1.7"
            >
              Choose a conversation from the sidebar to start chatting.
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;