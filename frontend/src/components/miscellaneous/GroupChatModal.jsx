import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Input, Text, Flex, CloseButton } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "./UserBadge";
import UserListItem from "./UserListItem";

const GroupChatModal = ({ isOpen, onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toaster.create({
        title: "Failed to load users",
        description: "Please try again.",
        type: "error",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toaster.create({
        title: "User already added",
        type: "warning",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toaster.create({
        title: "Please fill all fields & add at least 2 users",
        type: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );

      setChats([data, ...chats]);

      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);

      onClose();
    } catch (error) {
      toaster.create({
        title: "Failed to create group",
        description: "Please try again.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <Box
      position="fixed"
      inset="0"
      bg="rgba(0,0,0,0.72)"
      backdropFilter="blur(6px)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="9999"
      onClick={onClose}
    >
      <Box
        bg="#121212"
        color="white"
        w={{ base: "92%", sm: "430px" }}
        p={6}
        borderRadius="2xl"
        border="1px solid rgba(255,255,255,0.08)"
        boxShadow="0 25px 60px rgba(0,0,0,0.5)"
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Flex justify="space-between" align="center" mb={5}>
          <Text fontSize="2xl" fontWeight="700" letterSpacing="0.5px">
            Create Group Chat
          </Text>

          <CloseButton onClick={onClose} color="white" size="sm" />
        </Flex>

        {/* Group Name */}
        <Input
          mb={3}
          placeholder="Group Chat Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          bg="rgba(255,255,255,0.05)"
          border="1px solid rgba(255,255,255,0.12)"
          color="white"
          _placeholder={{ color: "gray.400" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px #3182ce",
          }}
        />

        {/* Search User */}
        <Input
          mb={3}
          placeholder="Search users..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          bg="rgba(255,255,255,0.05)"
          border="1px solid rgba(255,255,255,0.12)"
          color="white"
          _placeholder={{ color: "gray.400" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px #3182ce",
          }}
        />

        {/* Selected Users */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={3} minH="36px">
          {selectedUsers.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              handleFunction={() => handleDelete(u)}
            />
          ))}
        </Box>

        {/* Search Results */}
        {loading ? (
          <Text color="gray.400" mt={2}>
            Searching...
          </Text>
        ) : (
          <Box
            maxH="220px"
            overflowY="auto"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {searchResult.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleGroup(user)}
              />
            ))}
          </Box>
        )}

        {/* Footer */}
        <Flex justify="flex-end" mt={6}>
          <Button
            bg="#2563EB"
            color="white"
            fontWeight="600"
            px={6}
            _hover={{
              bg: "#1D4ED8",
            }}
            onClick={handleSubmit}
          >
            Create Chat
          </Button>
        </Flex>
      </Box>
    </Box>,
    document.body,
  );
};

export default GroupChatModal;
