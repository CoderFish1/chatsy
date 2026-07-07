import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  CloseButton,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { Settings } from "lucide-react"; // Or use any icon you prefer
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserBadgeItem from "./UserBadge";
import UserListItem from "./UserListItem";


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, children, fetchMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSearchResult([]);
    setGroupChatName("");
  };

  // ---- 1. RENAME GROUP ----
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      toaster.create({ title: "Group Renamed Successfully", type: "success" });
    } catch (error) {
      toaster.create({ title: "Failed to rename group", type: "error" });
      setRenameLoading(false);
    }
  };

  // ---- 2. SEARCH USERS ----
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toaster.create({ title: "Failed to load search results", type: "error" });
      setLoading(false);
    }
  };

  // ---- 3. ADD USER TO GROUP ----
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User is already in the group!",
        type: "warning",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({ title: "Only admins can add someone!", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toaster.create({ title: "User Added", type: "success" });
    } catch (error) {
      toaster.create({ title: "Failed to add user", type: "error" });
      setLoading(false);
    }
  };

  // ---- 4. REMOVE USER FROM GROUP (Or Leave Group) ----
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove someone!",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config,
      );

      // If the user removed themselves, clear the selected chat
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      toaster.create({ title: "Failed to remove user", type: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button inside the ChatBox Header */}
      <Box display="inline-block" onClick={onOpen} cursor="pointer">
        {children}
      </Box>

      {/* The Portal Modal */}
      {isOpen &&
        createPortal(
          <Box
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="rgba(0, 0, 0, 0.7)"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex="9999"
            onClick={onClose}
          >
            <Box
              bg="#121212"
              color="white"
              w={{ base: "90%", md: "420px" }}
              p={6}
              borderRadius="md"
              border="1px solid #333"
              boxShadow="2xl"
              onClick={(e) => e.stopPropagation()}
              display="flex"
              flexDirection="column"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="2xl" fontWeight="bold" noOfLines={1}>
                  {selectedChat.chatName}
                </Text>
                <CloseButton onClick={onClose} color="white" />
              </Flex>

              <Box display="flex" flexDirection="column" alignItems="center">
                {/* Current Users List */}
                <Box
                  w="100%"
                  display="flex"
                  flexWrap="wrap"
                  pb={3}
                  mb={3}
                  borderBottom="1px solid #333"
                >
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </Box>

                {/* Rename Group Field */}
                <Flex w="100%" mb={4}>
                  <Input
                    placeholder="Chat Name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                    mr={2}
                  />
                  <Button
                    colorPalette="teal"
                    loading={renameLoading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </Flex>

                {/* Search & Add New Users */}
                <Input
                  mb={3}
                  placeholder="Add User to group"
                  onChange={(e) => handleSearch(e.target.value)}
                />

                {/* Search Results */}
                {loading ? (
                  <Spinner size="lg" mt={4} />
                ) : (
                  <Box w="100%" maxH="180px" overflowY="auto">
                    {searchResult?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Footer (Leave Group) */}
              <Flex justify="flex-end" mt={5}>
                <Button colorPalette="red" onClick={() => handleRemove(user)}>
                  Leave Group
                </Button>
              </Flex>
            </Box>
          </Box>,
          document.body,
        )}
    </>
  );
};

export default UpdateGroupChatModal;
