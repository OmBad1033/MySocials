import { Avatar, Box, Flex, Image, Skeleton, Text, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { IoIosMailOpen, IoIosMail } from "react-icons/io";
import { useState } from "react";

function Message({ ownMessage, message }) {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const { colorMode } = useColorMode();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Flex
            bg={colorMode === "dark" ? "green.900" : "green.600"}
            maxW={"350px"}
            p={1}
            borderRadius={"md"}
          >
            <Flex direction={"column"}>
              {message.img && !imgLoaded && (
                <Flex mt={5} maxW={'200px'}>
                <Skeleton w={"200px"} h={"200px"}/>
                <Image src={message?.img} hidden onLoad={() => setImgLoaded(true)} borderRadius={4} />
                </Flex>
              )}
              {message.img && imgLoaded && (
                <Flex mt={5} maxW={'200px'}>
                <Image src={message?.img} borderRadius={4} />
                </Flex>
              )}
                
              {message.text && <Text color={"white"}>{message?.text}</Text>}
            </Flex>
            <Box alignSelf={"flex-end"} ml={1} fontWeight={"bold"}>
              {message.seen ? (
                <IoIosMailOpen size={10} />
              ) : (
                <IoIosMail size={10} />
              )}
            </Box>
          </Flex>
          <Avatar
            size={"sm"}
            name={currentUser.username}
            src={currentUser.profilePic}
          />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar
            size={"sm"}
            name={selectedConversation.username}
            src={selectedConversation.userProfilePic}
          />

          <Text
            maxW={"350px"}
            bg={"gray.700"}
            color={"black"}
            p={1}
            borderRadius={"md"}
          >
            {message.img && !imgLoaded && (
                <Flex mt={5} maxW={'200px'}>
                <Skeleton w={"200px"} h={"200px"}/>
                <Image src={message?.img} hidden onLoad={() => setImgLoaded(true)} borderRadius={4} />
                </Flex>
              )}
              {message.img && imgLoaded && (
                <Flex mt={5} maxW={'200px'}>
                <Image src={message?.img} borderRadius={4} />
                </Flex>
              )}
            {message.text && <Text color={"white"}>{message?.text}</Text>}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default Message;
