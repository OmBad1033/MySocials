import  { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postsAtom from '../../atoms/postsAtom';

function UserPage() {
  const {user, load} = useGetUserProfile();
  const {username, } = useParams();
  const showToast = useShowToast();
  const [userPosts, setUserPosts] = useRecoilState(postsAtom);
  const [fetching , setFetching] = useState(true);
  useEffect(() => {
    
    const getPosts = async () => {
      setFetching(true);
      try{
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log("POSTS", data);
        if (data.error) {
          showToast("Invalid Username",data.error,"error");
          return;
        }
        setUserPosts(data);
      } catch (error) {
        console.log(error);
      } finally{
        setFetching(false);
      }
    }
    getPosts();
    
  }, [username, showToast, setUserPosts, setFetching]);
  if (!user && load){
    //Loading icon in center
    return (
        <Flex
        justifyContent="center"
        alignItems="center"
        h="100vh"
        >
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
  if(!user && !load) return <h1>User not found</h1>;
  return (
    <>
        <UserHeader user={user}/> 
        {!fetching && userPosts.length === 0 && <h1>User has no posts</h1>}
        {
          fetching && (
            <Flex
            justifyContent="center"
            my={12}
            >
            <Spinner
            size="xl"
            />
            </Flex>
          )
        }
        {
          !fetching && userPosts && (userPosts.map((post) => (
            <Post key={post._id} post={post} postedBy={user._id} />
          )))
        }
       
    </>
  )
}

export default UserPage