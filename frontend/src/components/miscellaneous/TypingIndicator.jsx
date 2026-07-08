import React from "react";
import { Flex, Box } from "@chakra-ui/react";

const TypingIndicator = () => {
  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0) scale(0.85); opacity: 0.5; }
            40% { transform: translateY(-6px) scale(1.15); opacity: 1; }
          }

          @keyframes popIn {
            0% { transform: scale(0.85) translateY(4px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 6px rgba(99, 179, 237, 0.15); }
            50% { box-shadow: 0 0 14px rgba(99, 179, 237, 0.35); }
          }

          .typing-bubble {
            animation: popIn 0.25s ease-out, glow 2.4s ease-in-out infinite;
          }

          .typing-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: linear-gradient(135deg, #63b3ed, #b794f4);
            animation: bounce 1.4s infinite ease-in-out both;
          }
        `}
      </style>

      <Flex
        className="typing-bubble"
        align="center"
        gap={1.5}
        p={3}
        px={4}
        bg="rgba(255, 255, 255, 0.06)"
        backdropFilter="blur(8px)"
        border="1px solid rgba(255, 255, 255, 0.12)"
        borderRadius="20px"
        borderBottomLeftRadius="4px"
        w="fit-content"
        mb={2}
      >
        <Box className="typing-dot" style={{ animationDelay: "-0.32s" }} />
        <Box className="typing-dot" style={{ animationDelay: "-0.16s" }} />
        <Box className="typing-dot" />
      </Flex>
    </>
  );
};

export default TypingIndicator;
