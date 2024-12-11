

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  Card,
} from '@chakra-ui/react'
import EncryptButton from "./Encrypt_Button";

import { useState } from 'react'
import Login from './Login'
import authAtom from '../../atoms/authAtom'
import { useSetRecoilState } from 'recoil'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../../atoms/userAtom'
import { Label } from "./ui/label";
import { Input as Inputt } from "./ui/input";
import {ContainerScroll} from "./ui/container-scroll-animation";
import { cn } from "@/lib/utils";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen= useSetRecoilState(authAtom);
  const setUser = useSetRecoilState(userAtom);
  const [input, setInput] = useState({name: "", username: "", email: "", password: ""});
  const showtoast = useShowToast();
  const [load, setLoad] = useState(false);
  const handleSignUp = async () => {
    console.log(JSON.stringify(input));
    setLoad(true);
    try {
        const res = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        })
        const data = await res.json();
        console.log(data);
        if (data.error) {
            showtoast("Error",data.error,"error");
            return;
        }
        localStorage.setItem('user-threads', JSON.stringify(data));
        console.log(data);
        setUser(data);
    } catch (err) {
      console.log(err);
    } finally {
        setLoad(false);
    }
  }
  return (
    <>
     <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              ⬇ <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Sign up <br />  👨🏻‍💻
              </span>
            </h1>
          </>
        }
      >
        <>
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="name" isRequired>
                  
                  <LabelInputContainer>
                    <Label htmlFor="Full Name">Full Name</Label>
                    <Inputt id="firstname" placeholder="Full Name" type="text" onChange={(e) => setInput({...input, name: e.target.value})} value={input.name} />
                  </LabelInputContainer>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="username" isRequired>
                  <LabelInputContainer>
                    <Label htmlFor="Username">Username</Label>
                    <Inputt id="Username" placeholder="Username" type="text" onChange={(e) => setInput({...input, username: e.target.value})} value={input.username} />
                  </LabelInputContainer>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <LabelInputContainer>
                <Label htmlFor="email">Email address</Label>
                <Inputt id="email" placeholder="Email address" type="email" onChange={(e) => setInput({...input, email: e.target.value})} value={input.email} />
              </LabelInputContainer>
            </FormControl>
            <FormControl id="password" isRequired>
              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Inputt id="password" placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e)=>setInput({...input, password: e.target.value})} value={input.password} />
              </LabelInputContainer>
            </FormControl>
            <Stack spacing={10} pt={2}>
            <button className="w-full" onClick={handleSignUp}>
                    <EncryptButton buttonText="Sign up" />
               </button>
      
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link to="/login" color={'blue.400'} onClick={() => setAuthScreen('login')}>Login</Link>
              </Text>

            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    </>
    </ContainerScroll>
    </>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
 
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};