import React from "react";
import { Box, Button, Text, Image } from "@chakra-ui/react";
import { X } from "lucide-react";

const ProfileModalBox = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User",
  )}&background=random&color=fff&size=150`;

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(8px)"
        zIndex="2000"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bg="rgba(15, 15, 15, 0.95)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          borderRadius="xl"
          p={8}
          w="400px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="relative"
          boxShadow="dark-lg"
        >
          <Button
            position="absolute"
            top={3}
            right={3}
            variant="ghost"
            color="gray.400"
            _hover={{ color: "white", bg: "whiteAlpha.200" }}
            onClick={onClose}
          >
            <X size={24} />
          </Button>

          <Text
            fontSize="3xl"
            color="white"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontWeight="bold"
            mb={6}
          >
            {user?.name || "User Profile"}
          </Text>

          <Image
            borderRadius="full"
            boxSize="150px"
            src={user?.pic || fallbackAvatar}
            onError={(e) => {
              e.target.src = fallbackAvatar;
            }}
            alt={user?.name}
            objectFit="cover"
            border="2px solid rgba(255, 255, 255, 0.2)"
            mb={6}
          />

          <Text fontSize="lg" color="gray.300">
            Email: {user?.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default ProfileModalBox;
