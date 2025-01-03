import { SearchIcon } from "@chakra-ui/icons";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import {
  Box,
  Button,
  Flex,
  Input,
  SkeletonCircle,
  SkeletonText,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";

function ChatPage() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchTerm}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Invalid Username", searchedUser.error, "error");
        return;
      }
      const messageYourself = searchedUser._id === currentUser._id;
      if (messageYourself) {
        showToast("Invalid Username", "You cannot chat with yourself", "error");
        return;
      }

      const conversationAlreadyExist = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExist) {
        setSelectedConversation({
          _id: conversationAlreadyExist._id,
          userId: searchedUser._id,
          userProfilePic: searchedUser.profilePic,
          username: searchedUser.username,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations([...conversations, mockConversation]);
      setSelectedConversation({
        _id: mockConversation._id,
        userId: searchedUser._id,
        userProfilePic: searchedUser.profilePic,
        username: searchedUser.username,
        mock: true,
      });
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("api/messages/conversations");
        const data = await res.json();
        setConversations(data);
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
      } catch (error) {
        showToast("error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  useEffect(() => {
    socket?.on("messagesSeen",(conversationId) => {
      console.log("messages seen frontend", conversationId);
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
        })
    });
  }, [socket, setConversations]);

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{
        base: "10%",
        sm: "90%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex flex={30} gap={3} flexDirection={"column"}>
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Chat 💬
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for user"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {isLoading &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <Flex key={i} gap={4} p={"1"} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <SkeletonText noOfLines={1} w={"50%"} />
                  <SkeletonText noOfLines={1} w={"80%"} />
                </Flex>
              </Flex>
            ))}
          {!isLoading &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={"sm"}>Start a new conversation</Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
}

export default ChatPage;
