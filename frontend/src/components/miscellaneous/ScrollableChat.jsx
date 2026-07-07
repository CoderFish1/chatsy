import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Image } from "@chakra-ui/react";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
            {/* Conditional Avatar Rendering */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Image
                mt="7px"
                mr={2}
                boxSize="32px"
                borderRadius="full"
                cursor="pointer"
                title={m.sender.name}
                border="1px solid rgba(255,255,255,0.15)"
                src={
                  m.sender.pic ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    m.sender.name,
                  )}&background=random&color=fff`
                }
                alt={m.sender.name}
              />
            )}

            {/* Message Bubble */}
            <span
              style={{
                backgroundColor:
                  m.sender._id === user._id ? "#0284c7" : "#27272a", // Blue for user, dark gray for sender
                color: "white",
                borderRadius: "18px",
                padding: "8px 16px",
                maxWidth: "75%",
                fontSize: "15px",
                lineHeight: "1.4",
                border: "1px solid rgba(255,255,255,0.05)",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 4 : 12, // More space if it's a new sender
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
