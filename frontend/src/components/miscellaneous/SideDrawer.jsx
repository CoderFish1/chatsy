import React, { useState } from "react";
import { Box, Button, Text, Image } from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "@chakra-ui/react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { ChatState } from "../../context/ChatProvider";

const SideDrawer = () => {
  // YOUR STATES - 100% UNTOUCHED
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user } = ChatState();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      p="10px 20px"
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
        >
          <Search size={20} />
          <Text display={{ base: "none", md: "flex" }} px="4" fontWeight="500">
            Search User
          </Text>
        </Button>
      </Box>

      {/* Center Column: Title */}
      <Box flex="1" display="flex" justifyContent="center">
        <Text
          fontSize="2xl"
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
        gap={4}
      >
        {/* Notification Menu */}
        <Box position="relative">
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                p={1}
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                <Bell size={22} />
              </Button>
            </MenuTrigger>
            <MenuContent
              position="absolute"
              top="100%"
              right="0"
              mt="2"
              zIndex="1000"
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
          </MenuRoot>
        </Box>

        {/* Profile Menu */}
        <Box position="relative">
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                px={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Image
                    boxSize="32px"
                    borderRadius="full"
                    src={
                      user?.pic ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt={user?.name || "Profile"}
                    cursor="pointer"
                    objectFit="cover"
                    border="1px solid rgba(255,255,255,0.2)"
                  />
                  <ChevronDown size={16} />
                </Box>
              </Button>
            </MenuTrigger>
            <MenuContent
              position="absolute"
              top="100%"
              right="0"
              mt="2"
              zIndex="1000" // Forces the menu to float above everything else
              bg="rgba(15, 15, 15, 0.95)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="md"
              boxShadow="dark-lg"
              minW="150px"
              p={1}
            >
              <MenuItem
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
    </Box>
  );
};

export default SideDrawer;
