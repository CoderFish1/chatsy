import React from "react";
import { Box, Text, Tabs } from "@chakra-ui/react";
import Login from "@/components/Authentication/Login";
import SignUp from "@/components/Authentication/SignUp";

const Home = () => {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="transparent"
    >
      {/* --- HERO TYPOGRAPHY START --- */}
      <Box textAlign="center" mb={10}>
        <Text
          fontSize="5xl"
          fontWeight="900"
          color="white"
          fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
          letterSpacing="-1.5px"
          lineHeight="1"
          textShadow="0px 8px 24px rgba(0, 0, 0, 0.8)"
        >
          Chatsy
        </Text>
        <Text
          fontSize="xs"
          fontWeight="700"
          color="gray.300"
          textTransform="uppercase"
          letterSpacing="5px"
          mt={3}
          textShadow="0px 4px 12px rgba(0, 0, 0, 0.8)"
        >
          Talk Easy
        </Text>
      </Box>
      {/* --- HERO TYPOGRAPHY END --- */}

      <Box
        w="400px"
        maxW="90vw"
        maxH="85vh"
        overflowY="auto"
        bg="#0a0a0a"
        borderRadius="2xl"
        border="1px solid"
        borderColor="#222"
        p={6}
        boxShadow="xl"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#333",
            borderRadius: "4px",
          },
        }}
      >
        <Tabs.Root defaultValue="login" variant="plain" fitted>
          <Tabs.List
            bg="#141414"
            borderRadius="xl"
            border="1px solid"
            borderColor="#222"
            p="4px"
            mb={6}
            gap={1}
          >
            <Tabs.Trigger
              value="login"
              flex={1}
              fontSize="sm"
              fontWeight="600"
              color="gray.400"
              borderRadius="lg"
              cursor="pointer"
              py={2}
              transition="all 0.2s"
              _selected={{ color: "black", bg: "white", boxShadow: "sm" }}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="signup"
              flex={1}
              fontSize="sm"
              fontWeight="600"
              color="gray.400"
              borderRadius="lg"
              cursor="pointer"
              py={2}
              transition="all 0.2s"
              _selected={{ color: "black", bg: "white", boxShadow: "sm" }}
            >
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login" p={0}>
            <Login />
          </Tabs.Content>
          <Tabs.Content value="signup" p={0}>
            <SignUp />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
};

export default Home;
