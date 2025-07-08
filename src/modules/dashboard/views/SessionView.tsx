"use client";

import { Box, VStack, Heading, Text, Center, Button, Icon, useColorModeValue } from "@chakra-ui/react";
import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { ChatMessage } from "../components/ChatMessage";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  audioUrl?: string;
}

interface SessionViewProps {
  session: {
    id: string;
    title: string;
    agent: {
      name: string;
      icon: any;
      color: string;
    };
  };
}

export function SessionView({ session }: SessionViewProps) {
  const { startRecording, stopRecording, isRecording, audioBlob } = useVoiceRecording();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (audioBlob) {
      handleSendAudio();
    }
  }, [audioBlob]);

  const handleSendAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const userMessage: Message = {
          id: Date.now().toString(),
          text: data.text,
          sender: "user",
          audioUrl: URL.createObjectURL(audioBlob),
        };
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Agent's response",
          sender: "agent",
          audioUrl: data.audioUrl,
        };
        setMessages((prev) => [...prev, userMessage, agentMessage]);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <VStack flex={1} p={6} spacing={6} align="stretch">
      <Box>
        <Heading size="lg">{session.title}</Heading>
        <Text color="gray.500">A conversation with {session.agent.name}</Text>
      </Box>

      <Box
        flex={1}
        p={4}
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="lg"
        overflowY="auto"
        display="flex"
        flexDirection="column-reverse"
      >
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} agent={session.agent} />
          ))}
        </VStack>
      </Box>

      <Center>
        <VStack>
          <Button
            size="lg"
            borderRadius="full"
            colorScheme={isRecording ? "red" : "blue"}
            onClick={isRecording ? stopRecording : startRecording}
            isLoading={isTranscribing}
          >
            <Icon as={Mic} />
          </Button>
          <Text fontSize="sm" color="gray.500">
            {isRecording ? "Recording..." : "Press to speak"}
          </Text>
        </VStack>
      </Center>
    </VStack>
  );
}