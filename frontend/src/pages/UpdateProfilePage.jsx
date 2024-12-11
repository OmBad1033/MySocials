'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom); 
    const [input, setInput] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        password: "",
        bio: user.bio,
        profilePic: user.profilePic
    });
    const fileRef = useRef(null);
    const {handleImageChange, imgUrl} = usePreviewImg();
    const showToast = useShowToast();
    const [updated, setUpdated] = useState(false);
    const navigate = useNavigate();
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updated) return;
        setUpdated(true);
        try{
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...input, profilePic: imgUrl})
            })
            const data = await res.json();
            if (data.error) {
                showToast("Error",data.error,"error");
                return;
            }   
            console.log(data);
            setUser(data);
            localStorage.setItem('user-threads', JSON.stringify(data));
            showToast("Success","Profile updated successfully","success");
            navigate(`/${data.username}`);

        } catch(err){       
            showToast("Error",err,"error");
        } finally {
            setUpdated(false);
        }
        
    }
  return (
    <form onSubmit={handleSubmit}>
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.850')}
      my={6}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={4}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow="md" src={imgUrl || input.profilePic}>
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Icon</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder={user.username}
            onChange={(e) => setInput({...input, username: e.target.value})}
            value={input.username}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="fullName" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder={user.name}
            onChange={(e) => setInput({...input, name: e.target.value})}
            value={input.name}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="Bio" isRequired>
          <FormLabel>Biography</FormLabel>
          <Input
            placeholder={user.bio}
            onChange={(e) => setInput({...input, bio: e.target.value})}
            value={input.bio}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder={user.email}
            onChange={(e) => setInput({...input, email: e.target.value})}
            value={input.email}
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="**********"
            onChange={(e) => setInput({...input, password: e.target.value})}
            value={input.password}
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            type="submit"
            isLoading={updated}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}