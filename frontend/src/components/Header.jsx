import { Flex, Image, useColorMode, Link, Button } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import useLogout from "../hooks/useLogout";
import authAtom from "../../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { BsLightning, BsLightningFill } from "react-icons/bs";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);
  const handleLogout = useLogout();
  const setAuthScreen = useSetRecoilState(authAtom);
  const toggleDarkMode = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      if(colorMode === "dark"){
        toggleColorMode();
      }
    } else {
      htmlElement.classList.add("dark");
      if(colorMode !== "dark"){
        toggleColorMode();
      }
    }
  };
  
  return (
 
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {currentUser && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {!currentUser && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          Login
        </Link>
      )}

      {colorMode === "dark" ? (
        <BsLightningFill size={24} onClick={toggleDarkMode  }/>
      ):(
        <BsLightning size={24} onClick={toggleDarkMode}/>
      )}
      {currentUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${currentUser.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Button size={"sm"} onClick={handleLogout}>
            <CiLogout size={20} />
          </Button>
        </Flex>
      )}

      {!currentUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link
            as={RouterLink}
            to={"/auth"}
            onClick={() => setAuthScreen("Signup")}
          >
            Signup
          </Link>
        </Flex>
      )}
    </Flex>
  );
}

export default Header;
