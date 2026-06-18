import React, { useState, useRef } from "react";
import { VStack, Box, Text, Input, Button, Image } from "@chakra-ui/react";

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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [picPreview, setPicPreview] = useState(null);
  const fileRef = useRef();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  

  const submitHandler = () => {};

  const postDetails = () => {};


  return (
    <VStack gap={4} align="stretch">
      {/* Avatar row */}
      <Box display="flex" alignItems="center" gap={4} mb={2}>
        <Box
          w="56px"
          h="56px"
          borderRadius="full"
          border="1px dashed"
          borderColor="#555"
          overflow="hidden"
          cursor="pointer"
          onClick={() => fileRef.current.click()}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="#141414"
          flexShrink={0}
          transition="all 0.2s"
          _hover={{ borderColor: "white" }}
        >
          {picPreview ? (
            <Image src={picPreview} w="100%" h="100%" objectFit="cover" />
          ) : (
            <Text
              fontSize="9px"
              color="gray.500"
              fontWeight="600"
              textAlign="center"
            >
              ADD
            </Text>
          )}
        </Box>
        <Box cursor="pointer" onClick={() => fileRef.current.click()}>
          <Text fontSize="sm" fontWeight="500" color="gray.200">
            Profile Picture
          </Text>
          <Text fontSize="xs" color="gray.500">
            Optional
          </Text>
        </Box>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={(e) => {
            postDetails(e.target.files[0]);
            const file = e.target.files[0];
            if (file) setPicPreview(URL.createObjectURL(file));
          }}
        />
      </Box>

      <Box>
        <Text as="label" {...labelStyle}>
          Name
        </Text>
        <Input
          isRequired
          value={name}
          onChange={(e) => setName(e.target.value)}
          {...inputStyle}
          type="text"
          placeholder="Your Name"
        />
      </Box>

      <Box>
        <Text as="label" {...labelStyle}>
          Email
        </Text>
        <Input
          isRequired
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          {...inputStyle}
          type="email"
          placeholder="abc@example.com"
        />
      </Box>

      <Box>
        <Text as="label" {...labelStyle}>
          Password
        </Text>
        <Box position="relative">
          <Input
          value={password}
          onChange={()=> setPassword(e.target.value)}
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

      <Box>
        <Text as="label" {...labelStyle}>
          Confirm Password
        </Text>
        <Box position="relative">
          <Input
            {...inputStyle}
            type={showConfirm ? "text" : "password"}
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
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "HIDE" : "SHOW"}
          </Text>
        </Box>
      </Box>

      <Button
        onClick={submitHandler}
        w="full"
        bg="white"
        color="black"
        fontWeight="700"
        fontSize="sm"
        borderRadius="lg"
        mt={3}
        py={6}
        _hover={{ bg: "gray.200" }}
        _active={{ bg: "gray.300", transform: "scale(0.98)" }}
        transition="all 0.2s"
      >
        Create Account
      </Button>
    </VStack>
  );
};

export default SignUp;
