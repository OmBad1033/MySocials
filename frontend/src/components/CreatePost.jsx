
import {
  AnimatePresence,
  motion,

} from "framer-motion";
import { useRef, useState } from "react";
import {
  Button,

  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Textarea,
  Text,
  Input,
  Flex,
  Image,
  CloseButton,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

function CreatePost({ isOpen, onClose }) {
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imgRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const [load, setLoad] = useState(false);
  const showToast = useShowToast();
  const [userPosts, setUserPosts] = useRecoilState(postsAtom);
  const {username} = useParams();
  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoad(true);
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      setLoad(false);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      } else {
        showToast("Success", data.message, "success");
        console.log(username, user.username);
        if (username === user.username) {
          console.log("same user");
          setUserPosts((postArray) => [data.newPost, ...postArray]);
        }
        setPostText("");
        setImgUrl("");
        onClose();
      }
    } catch (error) {
      setLoad(false);
      showToast("Error", error, "error");
    }
  };

  return (
    <>



      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content"
                onChange={handleChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign="right"
                m={1}
                color="gray.300"
              >
                {" "}
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                hidden
                ref={imgRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ cursor: "pointer", marginLeft: "5px" }}
                size={16}
                onClick={() => imgRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="post image" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={load}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePost;
