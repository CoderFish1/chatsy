import React, { useState } from "react";
import { VStack, Box, Text, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";

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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
      });

      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config,
      );

      toaster.create({
        title: "Login Successful",
        type: "success",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Invalid Email or Password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(e) => setPassword(e.target.value)}
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

      <VStack gap={3} mt={2}>
        <Button
          onClick={submitHandler}
          loading={loading}
          loadingText="Logging In..."
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
          onClick={async () => {
            setEmail("guest@example.com");
            setPassword("123456");
            await axios
              .post(
                "/api/user/login",
                { email: "guest@example.com", password: "123456" },
                { headers: { "Content-type": "application/json" } },
              )
              .then(({ data }) => {
                toaster.create({
                  title: "Login Successful through Guest account",
                  type: "success",
                });
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate("/chat");
              });
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
