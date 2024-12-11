import { Avatar, Flex, Text, Divider } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions';

function Comment({reply, lastReply}) {

  return (
    <>
        <Flex gap={4} py={2} my={2} w={"full"}>
            <Avatar size={"sm"} name={reply.username} src={reply.userAvatar} />
            <Flex gap={1} w={"full"} flexDirection={"column"}>
                <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>{reply.username}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <BsThreeDots />
                    </Flex>
                </Flex>
                <Text>{reply.text}</Text>
            </Flex>
        </Flex>

        {lastReply ? null : <Divider /> }
    </>
  )
}

export default Comment