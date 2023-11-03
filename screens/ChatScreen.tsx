import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ChatMessageComponent from "../components/ChatMessageComponent";
import ChatTextInputContainer from "../containers/Chat/ChatTextInputContainer";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import {
  ChatMessage,
  ChatMessageSender,
  OpenAIChatMessage,
  OpenAIChatRequestDto,
} from "../types/common";
import * as SecureStore from "expo-secure-store";
import { sendChatMessage } from "../services/Chat.service";
import { useMutation } from "@tanstack/react-query";
import useNotifications from "../hooks/useNotifications";
import { generateErrorResponseMessage } from "../utils/httpUtils";

const ChatScreen = () => {
  const { add } = useNotifications();
  const initialChatMessages: ChatMessage[] = [];
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialChatMessages);

  useEffect(() => {
    try {
      SecureStore.getItemAsync("chatMessages").then((chatMessages) => {
        if (chatMessages !== null) {
          onReceiveMessages(JSON.parse(chatMessages) as ChatMessage[], false);
        }
      });
    } catch (error) {
      console.error("Error retrieving chat message details: ", error);
    }
  }, []);

  const onReceiveMessages = (
    newChatMessage: ChatMessage[],
    shouldSave: boolean = true
  ) => {
    const newChatMessages: ChatMessage[] = [...chatMessages, ...newChatMessage];
    setChatMessages(newChatMessages);
    if (shouldSave) {
      SecureStore.setItemAsync("chatMessages", JSON.stringify(newChatMessages));
    }
  };

  const onReceive = (newChatMessage: ChatMessage) => {
    const newChatMessages: ChatMessage[] = [...chatMessages, newChatMessage];
    setChatMessages(newChatMessages);
    SecureStore.setItemAsync("chatMessages", JSON.stringify(newChatMessages));
  };

  const onSend = (newChatMessage: ChatMessage) => {
    const newChatMessages: ChatMessage[] = [...chatMessages, newChatMessage];
    setChatMessages(newChatMessages);
    sendChatMessageMutate({
      model: "gpt-3.5-turbo",
      messages: newChatMessages.map((chatMessage) => {
        return {
          content: chatMessage.content,
          role: chatMessage.sender,
        } as OpenAIChatMessage;
      }),
      temperature: 0.5,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
  };
  const { mutate: sendChatMessageMutate, isPending } = useMutation({
    mutationKey: ["sendChatMessage"],
    mutationFn: (openAIChatRequestDto: OpenAIChatRequestDto) =>
      sendChatMessage({
        model: openAIChatRequestDto.model,
        messages: openAIChatRequestDto.messages,
        temperature: openAIChatRequestDto.temperature,
        max_tokens: openAIChatRequestDto.max_tokens,
        top_p: openAIChatRequestDto.top_p,
        frequency_penalty: openAIChatRequestDto.frequency_penalty,
        presence_penalty: openAIChatRequestDto.presence_penalty,
      }),
    onSuccess: (data) => {
      let dataLast = data as any;
      const jsonFile = JSON.parse(dataLast["request"]["response"]);
      const receivedMessage: ChatMessage = {
        sender: ChatMessageSender.assistant,
        content: jsonFile["choices"][0]["message"]["content"],
        timestamp: new Date(),
      };

      onReceive(receivedMessage);
    },
    onError: (error: any) => {
      add({
        body: generateErrorResponseMessage(error),
        title: "Error!",
        type: "error",
        time: 5000,
      });
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.messagesContainer}>
        <FlatList
          data={chatMessages}
          renderItem={({ item }) => <ChatMessageComponent chatMessage={item} />}
          keyExtractor={(item) => item.timestamp.toString()}
        />
      </View>
      <View style={styles.textInputContainer}>
        <ChatTextInputContainer isPending={isPending} onSend={onSend} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginVertical: 18,
  },
  messagesContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 50,
    height: "80%",
  },
});

export default ChatScreen;
