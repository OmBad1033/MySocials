import { Flex, Input, InputGroup, InputRightElement, Modal, useDisclosure, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

function MessageInput({ setMessages }) {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const showToast = useShowToast();
  const imageRef = useRef(null);
  const {onClose} = useDisclosure();
  const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg();
  const [isSending , setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          img: imgUrl,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);
      setConversations((conversations) => {
        const updatedConversations = conversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
                img: imgUrl ? true: false,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      })
      setMessageText("");
      setImgUrl("");
      onClose();
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex gap={2} alignItems={"center"}>

      <form onSubmit={handleSendMessage} style={{flex:95}}>
        <InputGroup>
          <Input w={"full"} placeholder="Type a message" onChange={(e) => setMessageText(e.target.value)} value={messageText}/>
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoSendSharp color="green.500" />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"} p={2}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()}/>
        <input ref={imageRef} type="file" hidden onChange={handleImageChange}  />
      </Flex>
      <Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
    </Flex>

  );
}

export default MessageInput;
