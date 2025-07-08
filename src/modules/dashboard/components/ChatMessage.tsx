"use client";

import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AudioPlayer } from "./AudioPlayer";

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: "user" | "agent";
    audioUrl?: string;
  };
  agent: {
    name: string;
    icon: any;
    color: string;
  };
}

export function ChatMessage({ message, agent }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HStack
        align="start"
        spacing={3}
        justify={isUser ? "flex-end" : "flex-start"}
      >
        {!isUser && (
          <Avatar
            size="sm"
            bg={agent.color}
            color="white"
            icon={<agent.icon />}
          />
        )}
        <VStack align={isUser ? "flex-end" : "flex-start"} spacing={1}>
          <Box
            bg={isUser ? "primary.500" : "gray.100"}
            color={isUser ? "white" : "black"}
            p={3}
            borderRadius="lg"
            maxW="400px"
          >
            {message.audioUrl && <AudioPlayer src={message.audioUrl} />}
            <Text>{message.text}</Text>
          </Box>
          <Text fontSize="xs" color="gray.500">
            {isUser ? "You" : agent.name}
          </Text>
        </VStack>
        {isUser && <Avatar size="sm" name="User" />}
      </HStack>
    </motion.div>
  );
}
