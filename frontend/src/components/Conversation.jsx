import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import { IoIosMailOpen, IoIosMail } from "react-icons/io";
import { BsFillImageFill } from "react-icons/bs";


function Conversation({ conversation, isOnline }) {
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const colorMode = useColorMode();
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={()=> setSelectedConversation({
        _id:conversation._id,
        userId: user._id,
        userProfilePic: user.profilePic,
        username: user.username,
        mock: conversation.mock
      })}
      bg={selectedConversation._id === conversation._id ? (colorMode.colorMode==='light'?"gray.400":"gray.dark") : null}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
            lg: "lg",
          }}
          name={user.username}
          src={user.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : <AvatarBadge boxSize="1em" bg="gray.500" />}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"}>
          {user.username}
          <Image src="./verified.png" w={4} h={4} ml={1} />
        </Text>

        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage.sender && (
              lastMessage.seen ? <IoIosMailOpen size={10}/>: <IoIosMail size={10}/>
          )}
          {lastMessage.text.lenght > 18
            ? lastMessage.text.slice(0, 18) + "..."
            : lastMessage.text || <BsFillImageFill size={20}/>}
        </Text>
      </Stack>
    </Flex>
  );
}

export default Conversation;
