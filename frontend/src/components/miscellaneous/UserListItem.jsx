import React from "react";
import { Box, Text, Image } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User",
  )}&background=random&color=fff`;

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="rgba(255, 255, 255, 0.03)"
      _hover={{
        bg: "rgba(255, 255, 255, 0.1)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
      transition="all 0.2s ease-in-out"
      w="100%"
      display="flex"
      alignItems="center"
      color="white"
      px={3}
      py={3}
      borderRadius="lg"
      border="1px solid rgba(255, 255, 255, 0.05)"
    >
      <Image
        src={user?.pic || fallbackAvatar}
        onError={(e) => {
          e.target.src = fallbackAvatar;
        }}
        alt={user?.name}
        boxSize="45px"
        borderRadius="full"
        objectFit="cover"
        mr={4}
        border="1px solid rgba(255, 255, 255, 0.2)"
      />

      <Box display="flex" flexDirection="column">
        <Text
          fontWeight="600"
          fontSize="md"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          {user?.name}
        </Text>
        <Text fontSize="sm" color="gray.400">
          <Text as="span" fontWeight="bold" color="gray.300">
            Email:{" "}
          </Text>
          {user?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
