import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  Flex,
  IconButton,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "@chakra-ui/react";
import { Search, Bell, ChevronDown, X, Users } from "lucide-react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModalBox from "./ProfileModalBox";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import axios from "axios";
import { getSender, getSenderPic } from "../../config/ChatLogics";

// drawer components
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
} from "../ui/drawer";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Empty Search",
        description: "Please enter a name or email to search.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    const startTime = Date.now();
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);

      const elapsed = Date.now() - startTime;
      const minDelay = 1800;
      const remaining = Math.max(minDelay - elapsed, 0);
      setTimeout(() => setLoading(false), remaining);
    } catch (error) {
      setLoading(false);
      toaster.create({
        title: "Search Failed",
        description: "Could not load search results. Please try again.",
        type: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const accessChat = async (userId) => {
    if (loadingChat) return;

    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      const chatExists = chats.find((c) => c._id === data._id);

      if (!chatExists) {
        setChats([data, ...chats]);
      } else {
        toaster.create({
          title: "Chat already exists",
          description: "You already have a conversation with this user.",
          type: "info",
          duration: 3000,
        });
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setIsSearchOpen(false);
    } catch (error) {
      setLoadingChat(false);
      toaster.create({
        title: "Error fetching the chat",
        description: error.message || "Something went wrong.",
        type: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p={{ base: "8px 12px", sm: "10px 16px", md: "10px 20px" }}
        bg="rgba(10, 10, 10, 0.65)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
        color="white"
        position="relative"
        zIndex="9999"
      >
        {/* Left Column: Search */}
        <Box flex="1" display="flex" justifyContent="flex-start">
          <Button
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            title="Search Users to chat"
            onClick={() => setIsSearchOpen(true)}
            size={{ base: "sm", md: "md" }}
            px={{ base: "2", md: "4" }}
          >
            <Search size={20} />
            <Text
              display={{ base: "none", sm: "none", md: "flex" }}
              px="4"
              fontWeight="500"
              fontSize={{ base: "xs", md: "sm" }}
            >
              Search User
            </Text>
          </Button>
        </Box>

        {/* Center Column: Title */}
        <Box flex="1" display="flex" justifyContent="center">
          <Text
            fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="wide"
          >
            Chatsy
          </Text>
        </Box>

        {/* Right Column: Actions */}
        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={{ base: 2, sm: 3, md: 4 }}
        >
          {/* ---- NOTIFICATION MENU ---- */}
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                p={{ base: "6px", md: "1" }}
                color="white"
                position="relative"
                _hover={{ bg: "whiteAlpha.200" }}
                size={{ base: "sm", md: "md" }}
              >
                <Bell size={20} />
                {notification?.length > 0 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    bg="red.500"
                    color="white"
                    fontSize="10px"
                    fontWeight="bold"
                    borderRadius="full"
                    h="16px"
                    w="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {notification.length}
                  </Box>
                )}
              </Button>
            </MenuTrigger>

            <MenuContent
              zIndex="2000"
              bg="rgba(15, 15, 15, 0.95)"
              border="1px solid rgba(255, 255, 255, 0.08)"
              borderRadius="lg"
              boxShadow="dark-lg"
              p={2}
              position="absolute"
              top="100%"
              minW="260px"
              maxH="350px"
              overflowY="auto"
            >
              {!notification?.length && (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py={4}
                  px={2}
                >
                  <Bell
                    size={24}
                    color="#4A5568"
                    style={{ marginBottom: "8px" }}
                  />
                  <Text fontSize="sm" color="whiteAlpha.500" fontWeight="500">
                    No new notifications
                  </Text>
                </Flex>
              )}

              {notification?.length > 0 && (
                <Flex
                  justify="space-between"
                  align="center"
                  px={2}
                  pb={2}
                  mb={1}
                  borderBottom="1px solid rgba(255,255,255,0.08)"
                >
                  <Text fontSize="xs" color="whiteAlpha.600" fontWeight="600">
                    NOTIFICATIONS
                  </Text>
                  <Text
                    fontSize="xs"
                    color="blue.300"
                    fontWeight="600"
                    cursor="pointer"
                    _hover={{ color: "blue.200", textDecoration: "underline" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotification([]);
                    }}
                  >
                    Clear All
                  </Text>
                </Flex>
              )}

              {notification?.map((notif) => (
                <MenuItem
                  key={notif._id}
                  value={notif._id}
                  _hover={{ bg: "whiteAlpha.100" }}
                  cursor="pointer"
                  px={3}
                  py={2}
                  mb={1}
                  borderRadius="md"
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  <Flex align="center" gap={3} w="100%">
                    <Box
                      bg="whiteAlpha.200"
                      borderRadius="full"
                      boxSize="36px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      overflow="hidden"
                    >
                      {notif.chat.isGroupChat ? (
                        <Users size={18} color="#A0AEC0" />
                      ) : (
                        <Image
                          src={
                            getSenderPic(user, notif.chat.users) ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(getSender(user, notif.chat.users))}&background=random&color=fff`
                          }
                          boxSize="100%"
                          objectFit="cover"
                          alt="avatar"
                        />
                      )}
                    </Box>
                    <Box flex="1" overflow="hidden">
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="whiteAlpha.900"
                        isTruncated
                      >
                        {notif.chat.isGroupChat
                          ? notif.chat.chatName
                          : getSender(user, notif.chat.users)}
                      </Text>
                      <Text fontSize="xs" color="whiteAlpha.600" isTruncated>
                        {notif.chat.isGroupChat
                          ? "New message in group"
                          : "Sent you a message"}
                      </Text>
                    </Box>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg="blue.400"
                      flexShrink={0}
                    />
                  </Flex>
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>

          {/* ---- PROFILE MENU ---- */}
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                px={{ base: "1", md: "2" }}
                size={{ base: "sm", md: "md" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={{ base: 1, md: 2 }}
                >
                  <Image
                    boxSize={{ base: "28px", md: "32px" }}
                    borderRadius="full"
                    src={
                      user?.pic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random&color=fff`
                    }
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random&color=fff`;
                    }}
                    alt={user?.name || "Profile"}
                    cursor="pointer"
                    objectFit="cover"
                    border="1px solid rgba(255,255,255,0.2)"
                  />
                  <Box display={{ base: "none", md: "block" }}>
                    <ChevronDown size={16} />
                  </Box>
                </Box>
              </Button>
            </MenuTrigger>

            <MenuContent
              zIndex="2000"
              bg="rgba(15, 15, 15, 0.95)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="md"
              boxShadow="dark-lg"
              minW="150px"
              p={1}
              position="absolute"
              top="100%"
            >
              <MenuItem
                onClick={() => setIsProfileOpen(true)}
                value="profile"
                _hover={{ bg: "whiteAlpha.200" }}
                px={3}
                py={2}
                cursor="pointer"
                borderRadius="sm"
              >
                My Profile
              </MenuItem>
              <MenuItem
                value="logout"
                onClick={logoutHandler}
                _hover={{ bg: "red.500", color: "white" }}
                px={3}
                py={2}
                cursor="pointer"
                borderRadius="sm"
              >
                Logout
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>
      </Box>

      {/* ---- DRAWER COMPONENT ---- */}
      <DrawerRoot
        open={isSearchOpen}
        onOpenChange={(e) => setIsSearchOpen(e.open)}
        placement="start"
      >
        <DrawerBackdrop
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(4px)"
          zIndex="1500"
        />
        <DrawerContent
          bg="rgba(15, 15, 15, 0.95)"
          backdropFilter="blur(12px)"
          color="white"
          borderRight="1px solid rgba(255, 255, 255, 0.1)"
          zIndex="1600"
          w={{ base: "100%", sm: "100%", md: "400px" }}
          maxW="100%"
        >
          <DrawerHeader
            borderBottom="1px solid rgba(255,255,255,0.1)"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={3}
          >
            <DrawerTitle>Search Users</DrawerTitle>
            <DrawerCloseTrigger asChild>
              <IconButton
                aria-label="Close"
                variant="ghost"
                color="whiteAlpha.800"
                size="md"
                _hover={{ bg: "whiteAlpha.200", color: "white" }}
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={24} />
              </IconButton>
            </DrawerCloseTrigger>
          </DrawerHeader>

          <DrawerBody
            pt={{ base: 3, md: 4 }}
            px={{ base: 3, md: 4 }}
            display="flex"
            flexDir="column"
          >
            {/* Search Input Area */}
            <Box
              display="flex"
              gap={{ base: 1.5, md: 2 }}
              mb={{ base: 3, md: 4 }}
              flexDirection={{ base: "column", sm: "row" }}
            >
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="rgba(255,255,255,0.05)"
                border="1px solid rgba(255,255,255,0.2)"
                color="white"
                fontSize={{ base: "sm", md: "md" }}
                size={{ base: "sm", md: "md" }}
                _focus={{ border: "1px solid white", outline: "none" }}
              />
              <Flex gap={2}>
                <Button
                  onClick={handleSearch}
                  bg="white"
                  color="black"
                  _hover={{ bg: "gray.200" }}
                  size={{ base: "sm", md: "md" }}
                  flex="1"
                >
                  Go
                </Button>
                {/* Mobile-only secondary close button */}
                <Button
                  display={{ base: "flex", sm: "none" }}
                  onClick={() => setIsSearchOpen(false)}
                  variant="outline"
                  color="whiteAlpha.800"
                  borderColor="whiteAlpha.400"
                  size="sm"
                  flex="1"
                >
                  Cancel
                </Button>
              </Flex>
            </Box>

            {/* Loading / Results */}
            {loading ? (
              <Box mt={{ base: 3, md: 4 }}>
                <ChatLoading />
              </Box>
            ) : (
              <Box
                mt={{ base: 3, md: 4 }}
                display="flex"
                flexDirection="column"
                gap={{ base: 1.5, md: 2 }}
              >
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
              </Box>
            )}

            {loadingChat && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Spinner color="white" />
              </Box>
            )}

            {/* ---- MADE BY CREDITS ---- */}
            <Flex
              align="center"
              justify="center"
              p={3}
              borderTop="1px solid rgba(255,255,255,0.08)"
              mt="auto"
            >
              <Text fontSize="xs" color="whiteAlpha.400">
                © {new Date().getFullYear()} • By Shrey
              </Text>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <ProfileModalBox
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </>
  );
};

export default SideDrawer;
