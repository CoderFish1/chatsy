import React from "react";
import { Badge, CloseButton } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      display="flex"
      alignItems="center"
      onClick={handleFunction}
    >
      {user.name}
      <CloseButton size="sm" ml={1} />
    </Badge>
  );
};

export default UserBadgeItem;
