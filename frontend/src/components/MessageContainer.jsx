import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";
import MessageSound from "../assets/sounds/message.mp3";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

function MessageContainer() {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  //UseEffect to get new messages [socket]
  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        console.log("NEW MESSAGE in same conversation", message);
        console.log(selectedConversation._id, message.conversationId);
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      if (!document.hasFocus()) {
        const sound = new Audio(MessageSound);
        sound.play();
      }
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          console.log(
            "NEW MESSAGE trying to update",
            conversation._id,
            message.conversationId
          );
          if (conversation._id === message.conversationId) {
            console.log(
              "NEW MESSAGE updated in the old conv",
              conversation._id
            );
            return {
              ...conversation,
              lastMessage: {
                sender: message.sender,
                text: message.text,
                img: message.img ? true : false,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket.off("newMessage");
  }, [socket, selectedConversation]);

  useEffect(() => {
    setIsLoading(true);
    setMessages([]);
    const getMessages = async () => {
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setIsLoading(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  //UseEffect to mark messages as read [socket, currentUser._id, messages, selectedConversation]
  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1]?.sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessageAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
        username: selectedConversation.username,
      });
    }
    socket.on("messagesSeen", (conversationId) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) => {
            if (!message.seen) {
              return { ...message, seen: true };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    if (messageEndRef.current) {
      //messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <CardContainer className='p-0'>
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl border p-5  ">
        <Flex
          bg={useColorModeValue("gray.200", "gray.dark")}
          borderRadius={"md"}
          flexDirection={"column"}
          h="full"
          w="full"
        >
          <CardItem
            translateZ="100"
            translateY="-10"
            className="text-xl font-bold text-neutral-600 dark:text-white w-full h-full"
          >
            {/* Message header */}
            <Flex w={"full"} alignItems={"center"} gap={2} p={3}>
              <Avatar
                src={selectedConversation.userProfilePic}
                name={selectedConversation.username}
                alignItems={"center"}
              />
              <Text display={"flex"} alignItems={"center"}>
                {selectedConversation.username}{" "}
                <Image src="./verified.png" w={4} h={4} ml={1} />{" "}
              </Text>
            </Flex>
          </CardItem>

          <Divider />
          {/* Messages */}
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white w-full h-[500px] flex flex-col"
          >
            <Flex
              ref={scrollContainerRef}
              flexDir="column"
              gap={4}
              overflowY="auto"
              flex={1}
              p={4}
              className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              {isLoading &&
                [...Array(10).keys()].map((i) => (
                  <Flex
                    key={i}
                    gap={2}
                    alignItems="center"
                    p={2}
                    borderRadius="md"
                    alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                  >
                    {i % 2 === 0 && <SkeletonCircle size="7" />}
                    <Flex flexDir="column" gap={2}>
                      <Skeleton h="8px" w="250px" />
                      <Skeleton h="8px" w="250px" />
                    </Flex>
                    {i % 2 === 1 && <SkeletonCircle size="7" />}
                  </Flex>
                ))}

              {!isLoading &&
                messages.map((message, index) => (
                  <Flex
                    key={message._id}
                    direction="column"
                    ref={index === messages.length - 1 ? messageEndRef : null}
                  >
                    <Message
                      ownMessage={message.sender === currentUser._id}
                      message={message}
                    />
                  </Flex>
                ))}
            </Flex>
          </CardItem>
          <CardItem
            translateZ="80"
            className="text-xl font-bold text-neutral-600 dark:text-white w-full h-full"
          >
            <MessageInput setMessages={setMessages} />
          </CardItem>
        </Flex>
      </CardBody>
    </CardContainer>
  );
}

export default MessageContainer;
