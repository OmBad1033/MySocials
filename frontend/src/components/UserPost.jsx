import { Flex, Avatar, Box, Text, Image, Menu, MenuButton, MenuList, MenuItem,Portal } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";

function UserPost({ likes, replies, postImg, postTitle }) {
  const [like, setLike] = useState(true);
  return (
    <Link to="/om/post/1">
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name="Dan Abrahmov" src="/zuck-avatar.png" />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size={"xs"}
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              top={"0px"}
              left={"15px"}
              padding={"2px"}
            />
            <Avatar
              size={"xs"}
              name="Kent C"
              src="https://bit.ly/kent-c-dodds"
              position={"absolute"}
              bottom={"0px"}
              right={"-5px"}
              padding={"2px"}
            />
            <Avatar
              size={"xs"}
              name="Code BEAST"
              src="https://bit.ly/code-beast"
              position={"absolute"}
              bottom={"0px"}
              left={"5px"}
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                Dan Abrahmov
              </Text>
              <Image src="./verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                2d
              </Text>
              <Box className='icon-container' onClick={(e)=> e.preventDefault()}>
                        <Menu>
                            <MenuButton>
                                <BsThreeDots size={24} cursor={"pointer"}/>
                            </MenuButton>
                            <Portal>
                                <MenuList >
                                    <MenuItem>Repost</MenuItem>
                                    <MenuItem>Share</MenuItem>
                                    <MenuItem>Save</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
              
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{postTitle}</Text>
          {postImg && (
            <Box
              position={"relative"}
              borderRadius={20}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions like={like} setLike={setLike} />
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {likes} likes
            </Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {replies} replies
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

export default UserPost;
