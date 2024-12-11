import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import CreatePost from "../components/CreatePost";
import SuggestedUser from "../components/SuggestedUsers";

function HomePage() {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      setLoad(true);
      try {
        const res = await fetch("/api/posts/feed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoad(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap='10' alignItems={"flex-start"}>
    
      <Box flex={70}>
        {load && (
          <Flex justify="center">
            <Spinner size={"xl"} />
          </Flex>
        )}
        {!load && posts.length === 0 && (
          <Flex justify="center">
            <h1> No posts yet</h1>
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
        <CreatePost />
      </Box>
      <Box flex={30} display={{ base: "none", md: "block" }}>
        <SuggestedUser/>
      </Box>
    </Flex>
  );
}

export default HomePage;
