import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
  Menu,
  MenuButton,
  Portal,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
import  { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import {formatDistanceToNow} from 'date-fns';
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useDeletePost from "../hooks/useDeletePost";
import postsAtom from "../../atoms/postsAtom";


function PostPage() {
  const { user, load } = useGetUserProfile();
  const [userPosts, setUserPost] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const currentPost = userPosts[0];
  const { handleDeletePost } = useDeletePost(currentPost);

  useEffect(() => {
    const getPost = async () => {
      setUserPost([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setUserPost([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [setUserPost, showToast, pid]);

  if (!user && load) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }
  if (!currentPost) return null;
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.name} />
          <Flex gap={1} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="./verified.png" w={4} h={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
            </Text>
            <Box className="icon-container" onClick={(e) => e.preventDefault()}>
              <Menu>
                <MenuButton>
                  <BsThreeDots size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem>Repost</MenuItem>
                    <MenuItem>Share</MenuItem>
                    {currentUser?._id === user._id && (
                      <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                    )}
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Text my={2} mx={1}>
        {currentPost?.text}
      </Text>
      {currentPost?.img && (
        <Box
          position={"relative"}
          borderRadius={20}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost?.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={1}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            👋
          </Text>
          <Text color={"gray.light"}>
            Get the app to like and reply and post
          </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {
        currentPost?.replies?.map((comment) => (
          <Comment
            key={comment._id}
            reply = {comment}
            lastReply = {comment._id === currentPost.replies[currentPost.replies.length - 1]._id}
          />
        ))
      }
    </>
  );
}

export default PostPage;
