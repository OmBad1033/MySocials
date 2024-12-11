import {
  Skeleton,
  Text,
  Flex,
  SkeletonCircle,
  Box,
  Card,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

function SuggestedUsers() {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();
  const {colorMode} = useColorMode();
  useEffect(() => {
    setLoading(true);
    const getSuggestedUsers = async () => {
      try {
        const response = await fetch("/api/users/suggested");
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log("Users Suggested: ", data);
        setSuggestedUsers(data);
        setLoading(false);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Card p={5} bg={colorMode === "light" ? "gray.100" : "#0b0b0b"}>
        <Text mb={4} fontWeight={"bold"}>
          Suggested Users
        </Text>
        <Flex direction={"column"} gap={4}>
          {loading
            ? [...Array(5)].map((_, idx) => (
                <Flex
                  key={idx}
                  gap={2}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  {/* avatar skeleton */}
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>
                  {/* username and fullname skeleton */}
                  <Flex w={"full"} flexDirection={"column"} gap={2}>
                    <Skeleton h={"8px"} w={"80px"} />
                    <Skeleton h={"8px"} w={"90px"} />
                  </Flex>
                  {/* follow button skeleton */}
                  <Flex>
                    <Skeleton h={"20px"} w={"60px"} />
                  </Flex>
                </Flex>
              ))
            : suggestedUsers.map((user) => (
                <Card p={4} key={user._id} bg={colorMode === "light" ? "gray.200" : "gray.900"}>
                  <SuggestedUser key={user._id} user={user} />
                </Card>
              ))}
        </Flex>
      </Card>
    </>
  );
}

export default SuggestedUsers;
