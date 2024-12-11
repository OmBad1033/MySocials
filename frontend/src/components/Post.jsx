import {
  Flex,
  Avatar,
  Box,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import {formatDistanceToNow} from 'date-fns'
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import {AnimatedTooltip} from "./ui/animated-tooltip";
import {BackgroundGradient} from "./ui/background-gradient";

function Post({post, postedBy}) {
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [userPosts, setUserPosts] = useRecoilState(postsAtom);
  //fetch user
  useEffect(() => {
    try{
      const getUser = async () => {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Invalid Username",data.error,"error");
          return;
        }
        setUser(data);
      }
      getUser();
    } catch (error) {
      showToast("Error",error.message,"error");
      setUser(null);
    }
  },[postedBy, showToast, setUser]);
  if (!user) return null;
  
  const handleDeletePost = async (e) => {
    try{
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/delete/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error",data.error,"error");
        return;
      }
      showToast("Success",data.message,"success");
      setUserPosts((postArray) => postArray.filter((singlePost) => singlePost._id !== post._id));

    } catch(error) {
      showToast("Error",error.message,"error");
    }
}

const genericUserPhoto = "./user.png"; 

const uniqueUsernames = new Set();

const items = Array.isArray(post.replies) && post.replies.length > 0
  ? post.replies.reduce((acc, reply) => {
      if (acc.length < 4 && !uniqueUsernames.has(reply.username)) {
        uniqueUsernames.add(reply.username);
        acc.push({
          id: acc.length + 1, // ID based on current length of accumulated array
          name: reply.username,
          designation: 'Replied',
          image: reply.userProfilePic || genericUserPhoto, // Use generic photo if user photo is absent
        });
      }
      return acc;
    }, [])
  : [];




console.log(items);

  

  return (
  
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic} cursor={"pointer"}
            onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
            
            }}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                
                }}
              >
                {user.username}
              </Text>
              <Image src="./verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              
            </Flex>
          </Flex>
          <Text fontSize={"sm"}
            cursor={"pointer"}
            onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}/post/${post._id}`);
            
            }}
          >{post?.text}</Text>
          {post.img && (
            <BackgroundGradient containerClassName='p-0'>
            <Box
              position={"relative"}
              overflow={"hidden"}
              cursor={"pointer"}
              borderRadius={"xl"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}/post/${post._id}`);
            
            }}
            >
              
                <img src={post.img} w={"full"} cursor={"pointer"} />

              
            </Box>
            </BackgroundGradient>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
          <Flex position={"relative"}>
              {items.length>0 ? <AnimatedTooltip items={items} /> : (
                  <Text textAlign={"center"}>🥱</Text>
              )}
            </Flex>
          
        </Flex>
       
      </Flex>

  );
}

export default Post;
