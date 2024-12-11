import { Box, Container, Flex, useColorMode } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import CreatePost from "./components/CreatePost";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import ChatPage from "./pages/ChatPage";
import { FloatingDock } from "./components/ui/floating-dock";
import { AiFillHome, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { BsLightningFill } from "react-icons/bs";
import {BackgroundBeamsWithCollision} from './components/ui/background-beams-with-collision';
import {TextGenerateEffect} from './components/ui/text-generate-effect';
import {TextHoverEffect} from './components/ui/text-hover-effect';



function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const { colorMode } = useColorMode();
  let items =[];
  if(user){
    items = [
      {
        title: "Home",
        icon: <AiFillHome size={24} />,
        href: "/",
      },
      {
        title: "Chatting",
        icon: <BsChat size={24} />,
        href: "/chat",
      },
      {
        title: "Post",
        icon: <BsLightningFill size={24} />,
        href: "/",
      },
      {
        title: "Profile",
        icon: <AiOutlineUser size={24} />,
        href: `/${user.username}`,
      },
      {
        title: "Logout",
        icon: <AiOutlineLogout size={24} />,
        href: "/logout",
      },
    ];
  }
  
  
  const htmlElement = document.documentElement;

  if (colorMode !== "dark") {
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
    }
  } else {
    if (!htmlElement.classList.contains("dark")) {
      htmlElement.classList.add("dark");
    }
  }
  const desktopClassName = `fixed bottom-5 left-1/2 transform -translate-x-1/2 z-10 flex justify-center items-center shadow-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-black rounded-lg p-6`;

  return (
  <>
    <Box position="relative" w="100vw" h="100vh" overflow="hidden">
    <BackgroundBeamsWithCollision className="h-full">
      <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex="1" overflowY="auto">
        <Container
          maxW={pathname === "/" ? { base: "900px", md: "900px" } : "900px"}
          minH="100vh"
          display="flex"
          flexDirection="column"
        >
          <section data-scroll-section>
          <Header />
          </section>
          <section data-scroll-section>

          <Flex
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            className="py-2"
            >
              {!user && (<>
                <TextGenerateEffect words={"Sushhhh turn the lights off 🦉"} duration={5}  />
          <TextHoverEffect text="AUM" />
              </>)}
          
          </Flex>
          </section>
          <section data-scroll-section>

          <Box flex="1">
            <Routes>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={!user ? <AuthPage /> : <Navigate to="/" />}
              />
              <Route
                path="/update"
                element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/:username"
                element={
                  user ? (
                    <>
                      <UserPage />
                      <CreatePost />
                    </>
                  ) : (
                    <UserPage />
                  )
                }
              />
              <Route path="/:username/post/:pid" element={<PostPage />} />
              <Route
                path="/chat"
                element={user ? <ChatPage /> : <Navigate to="/auth" />}
              />
            </Routes>
          </Box>
          </section>
          {user && (
        <FloatingDock
          items={items}
          desktopClassName={desktopClassName}
        />
      )}
        </Container>
      </Box>
    </BackgroundBeamsWithCollision>
  </Box>
  </>



  );
}

export default App;
