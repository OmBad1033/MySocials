import { Box, Button, VStack, Flex, Text, Link, Portal, MenuList, MenuItem, Menu, MenuButton, useToast, useColorMode } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/avatar'
import React,{ useState } from 'react'
import { BsInstagram } from 'react-icons/bs'
import { FiGithub } from 'react-icons/fi'
import { CgMoreO } from 'react-icons/cg'
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { Link as RouterLink} from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import useFollowUnfollow from '../hooks/useFollowUnfollow'



function UserHeader({user}) {
    console.log(user);
    const { colorMode, toggleColorMode } = useColorMode();
    const bgColor = colorMode === 'light' ? 'gray.200' : 'gray.dark';
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const toast = useToast();
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom); // this is the user that logged in

    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
    console.log(following);
    const copyUrl = () => {
        const url = window.location.href;
        console.log(url);
        navigator.clipboard.writeText(url).then(() => {
            showToast("Copied", "Link copied to clipboard", "success");
        });
    }


  return (
    <>
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize ={"4xl"} fontWeight={"bold"}>{user.name}</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}> {user.username}</Text>
                    <Text fontSize={"xs"} bg={bgColor} color={textColor} p={1} borderRadius={"full"}> 
                        threads.next
                    </Text>
                </Flex>
            </Box>
            <Box paddingRight={5}>
                {user.profilePic ? (
                <Avatar
                    name={user.name}
                    src={user.profilePic}
                    size={{
                        base: "md",
                        sm: "xl"
                    }}
                />):(
                    <Avatar
                        name={user.name}
                        size={{
                            base: "md",
                            sm: "xl"
                        }}
                    />)}
                
            </Box>
            </Flex>
            <Text>{user.bio}</Text>
            {
                
                currentUser?._id === user._id ? (
                    <Link as={RouterLink} to="/update">
                        <Button>Edit Profile</Button>
                    </Link>
                ):console.log(currentUser?._id, user._id)
            }
            {
                currentUser?._id !== user._id ? (
                        <Button onClick={handleFollowUnfollow} isLoading={updating}>
                            {following ? "Unfollow" : "Follow"}
                        </Button>
                ):console.log(currentUser?._id, user._id)
            }

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>Insta.com</Link>
                </Flex>
                <Flex gap={3}>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"}/>
                    </Box>
                    <Box className='icon-container'>
                        <FiGithub size={24} cursor={"pointer"}/>
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"}/>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem onClick={copyUrl}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex flex="1" borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Posts</Text>
                </Flex>
                <Flex flex="1" borderBottom={"1px solid grey"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    </>
  )
}

export default UserHeader