import React, { useState } from "react";
import { Box, Button, Text, Image, Portal } from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "@chakra-ui/react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModalBox from "./ProfileModalBox";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { Spinner } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import axios from "axios";

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
  // YOUR STATES - 100% UNTOUCHED
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats } = ChatState(); // gets the user info from contextapi (usercontext) using localStorage

  // state of drawer opening and closing
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // state for profilemodal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();

  // logout functionality
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      // throws toast
      toaster.create({
        title: "Empty Search",
        description: "Please enter a name or email to search.",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    // api call for searching they user
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
      // failure toast
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

  // for accessing or chat creation function
  const accessChat = async (userId) => {
    if (loadingChat) return; // prevents double-fire from rapid clicks

    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      // sending the clicked user to backend to access/create the chat
      const { data } = await axios.post("/api/chat", { userId }, config);

      const chatExists = chats.find((c) => c._id === data._id);

      if (!chatExists) {
        setChats([data, ...chats]);
      } else {
        // chat already exists, notify user instead of adding duplicate
        toaster.create({
          title: "Chat already exists",
          description: "You already have a conversation with this user.",
          type: "info",
          duration: 3000,
        });
      }

      // setting the new chat as active one on screen
      setSelectedChat(data);

      // closing the side drawer
      setLoadingChat(false);

      // closing the side drawer
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
          {/* Notification Menu */}
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                p={{ base: "6px", md: "1" }}
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                size={{ base: "sm", md: "md" }}
              >
                <Bell size={20} />
              </Button>
            </MenuTrigger>
            <Portal>
              <MenuContent
                zIndex="2000"
                bg="rgba(15, 15, 15, 0.95)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="md"
                boxShadow="dark-lg"
                p={2}
              >
                <MenuItem
                  value="empty"
                  _hover={{ bg: "whiteAlpha.200" }}
                  cursor="pointer"
                >
                  No new notifications
                </MenuItem>
              </MenuContent>
            </Portal>
          </MenuRoot>

          {/* Profile Menu */}
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
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User",
                      )}&background=random&color=fff`
                    }
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User",
                      )}&background=random&color=fff`;
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
            <Portal>
              <MenuContent
                zIndex="2000"
                bg="rgba(15, 15, 15, 0.95)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="md"
                boxShadow="dark-lg"
                minW="150px"
                p={1}
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
            </Portal>
          </MenuRoot>
        </Box>
      </Box>

      {/* drawer component */}
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
          <DrawerHeader borderBottom="1px solid rgba(255,255,255,0.1)">
            <DrawerTitle>Search Users</DrawerTitle>
            <DrawerCloseTrigger color="gray.400" _hover={{ color: "white" }} />
          </DrawerHeader>

          <DrawerBody pt={{ base: 3, md: 4 }} px={{ base: 3, md: 4 }}>
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
              <Button
                onClick={handleSearch}
                bg="white"
                color="black"
                _hover={{ bg: "gray.200" }}
                size={{ base: "sm", md: "md" }}
                minW={{ base: "100%", sm: "auto" }}
              >
                Go
              </Button>
            </Box>

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
