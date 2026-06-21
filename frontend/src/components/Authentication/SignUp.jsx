import React, { useState, useRef } from "react";
import { VStack, Box, Text, Input, Button, Image } from "@chakra-ui/react";
// Ensure <Toaster /> is rendered somewhere in your app's root level!
import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);

  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords do not match",
        type: "error",
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
        "/api/user/signup",
        { name, email, password, pic },
        config,
      );
      toaster.create({
        title: "Registration Successful",
        type: "success",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toaster.create({
        title: "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const postDetails = async (file) => {
    if (!file) {
      toaster.create({
        title: "Please select an image!",
        type: "error",
      });
      return;
    }

    if (file.size > 5000000) {
      toaster.create({
        title: "Image must be less than 5MB",
        type: "error",
      });
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toaster.create({
        title: "Only JPG and PNG files are allowed",
        type: "error",
      });
      return;
    }

    try {
      setPicLoading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dtysorjmu");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dtysorjmu/image/upload",
        data,
      );

      console.log(response.data);

      setPic(response.data.secure_url);
      setPicPreview(response.data.secure_url);

      toaster.create({
        title: "Image uploaded successfully!",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      toaster.create({
        title: "Image upload failed",
        type: "error",
      });
    } finally {
      setPicLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <VStack gap={4} align="stretch">
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
          {picLoading ? (
            <Text
              fontSize="8px"
              color="gray.400"
              fontWeight="700"
              textAlign="center"
            >
              UPLOADING
            </Text>
          ) : picPreview ? (
            <Image
              src={picPreview}
              w="100%"
              h="100%"
              objectFit="cover"
              alt="Profile preview"
            />
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
          accept="image/jpeg, image/png"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </Box>

      <Box>
        <Text as="label" {...labelStyle}>
          Name
        </Text>
        <Input
          required
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
          required
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

      <Box>
        <Text as="label" {...labelStyle}>
          Confirm Password
        </Text>
        <Box position="relative">
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        loading={loading}
        loadingText="Creating Account..."
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
