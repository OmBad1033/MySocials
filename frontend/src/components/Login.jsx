"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { Label } from "./ui/label";
import { Input as Inputt } from "./ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import authAtom from "../../atoms/authAtom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import EncryptButton from "./Encrypt_Button";
import {CardSpotlight} from "./ui/card-spotlight";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const setAuthScreen = useSetRecoilState(authAtom);
  const [input, setInput] = useState({ username: "", password: "" });
  const showToast = useShowToast();
  const [load, setLoad] = useState(false);
  const [color, setColor] = useState("#262626");
  const {colorMode} = useColorMode();
  const handleLogin = async () => {
    setLoad(true);
    try {
      console.log(JSON.stringify(input));
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setLoad(false);
    }
  };

  useEffect(()=>{
    if(colorMode==='dark'){
      setColor('#262626')
    } else {
      setColor('#d5d5da')
    }

  },[colorMode])

  
  return (
    <Box width={"500px"} className="flex flex-col justify-center items-center">
    <CardSpotlight radius={150} color={color} className={'rounded-md'}>

        <Flex align={"center"} justify={"center"}>
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Stack align={"center"}>

                <Heading fontSize={"4xl"} textAlign={"center"} className="z-20">
                  Login
                </Heading>

            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.dark")}
              boxShadow={"lg"}
              p={8}
              w={{
                base: "full",
                sm: "400px",
              }}
            >
              <Stack spacing={4}>

                    <FormControl id="username" isRequired>
                      <LabelInputContainer>
                      <Label htmlFor="Username">Username</Label>
                      <Inputt id="Username" placeholder="Username" type="text" onChange={(e) =>
                          setInput({ ...input, username: e.target.value })
                        }
                        value={input.username} />
                    </LabelInputContainer>
                    </FormControl>



                
                  <FormControl id="password" isRequired>
                  <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Inputt id="password" placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e)=>setInput({...input, password: e.target.value})} value={input.password} />
              </LabelInputContainer>
                    
                  </FormControl>



                        <button className="w-full" onClick={handleLogin}>
                    <EncryptButton buttonText="Login" />
                    </button>
                   
             


                <Stack pt={6}>
                  <Text align={"center"} className="z-50">
                    Dont have an account?{" "}
                    <Link
                      color={"blue.400"}
                      onClick={() => setAuthScreen("signup")}
                    >
                      Sign Up
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>

    </CardSpotlight>
    </Box>
  );
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
