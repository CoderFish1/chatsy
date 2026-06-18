import React, { useState } from "react";
import { VStack, Box, Text, Input, Button } from "@chakra-ui/react";
import { LuSquareTerminal } from "react-icons/lu";

const inputStyle = {
  bg: "#141414",
  border: "1px solid",
  borderColor: "#333",
  color: "white",
  _placeholder: { color: "gray.500" },
  _focus: { borderColor: "white", boxShadow: "0 0 0 1px white" },
  borderRadius: "lg",
  transition: "all 0.2s",
};

const labelStyle = {
  fontSize: "11px",
  color: "gray.400",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  mb: 1.5,
  display: "block",
};

const submitHandler = () => {};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();

  return (
    <VStack gap={5} align="stretch" mt={2}>
      <Box>
        <Text as="label" {...labelStyle}>
          Email
        </Text>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          {...inputStyle}
          type="email"
          placeholder="you@example.com"
        />
      </Box>

      <Box>
        <Text as="label" {...labelStyle}>
          Password
        </Text>
        <Box position="relative">
          <Input
            value={password}
            onChange={() => setPassword(e.target.value)}
            {...inputStyle}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            pr="50px"
          />
          <Text
            position="absolute"
            right="12px"
            top="50%"
            transform="translateY(-50%)"
            fontSize="10px"
            fontWeight="700"
            color="gray.400"
            cursor="pointer"
            userSelect="none"
            _hover={{ color: "white" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </Text>
        </Box>
      </Box>

      {/* Button Group */}
      <VStack gap={3} mt={2}>
        <Button
          onClick={submitHandler}
          w="full"
          bg="white"
          color="black"
          fontWeight="700"
          fontSize="sm"
          borderRadius="lg"
          py={6}
          _hover={{ bg: "gray.200" }}
          _active={{ bg: "gray.300", transform: "scale(0.98)" }}
          transition="all 0.2s"
        >
          Login
        </Button>

        <Button
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
          w="full"
          bg="transparent"
          border="1px solid"
          borderColor="#333"
          color="white"
          fontWeight="600"
          fontSize="sm"
          borderRadius="lg"
          py={6}
          _hover={{ bg: "#1a1a1a", borderColor: "gray.500" }}
          _active={{ bg: "#222", transform: "scale(0.98)" }}
          transition="all 0.2s"
        >
          Guest Credentials
        </Button>
      </VStack>
    </VStack>
  );
};

export default Login;
