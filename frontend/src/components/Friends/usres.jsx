import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Center,
  Box,
  Image,
  Flex,
  Text,
  Stack,
  Heading,
  Avatar,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";


const Users = () => {
  const userId = useSelector((state) => state.auth.userId);
  const users = useSelector((state) => state.auth.users);
  const friends = useSelector((state) => state.friends.friends);

  
  const sendFriendsRequest = async (reqsTo) => {
    try {
      const response = await axios.post(`https://backend-kxp7.onrender.com/addFriends`, {
        reqsFrom: userId,
        reqsTo: reqsTo,
      });

      if (response.data.success) {
        // console.log(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const filteredUsers = users?.filter(
    (user) => !friends.some((friend) => friend.friend_id === user.id)
  );

  return (
    <div>
      <h1 className="users">
        {filteredUsers?.map((user) => (
          <Center key={user.id} py={6}>
            <Box
              maxW={"270px"}
              bg={useColorModeValue("white", "gray.800")}
              boxShadow={"2xl"}
              rounded={"md"}
              overflow={"hidden"}
            >
              <Image
                h={"120px"}
                w={"full"}
                src={
                  "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                }
                objectFit="cover"
                alt="#"
              />
              <Flex justify={"center"} mt={-12}>
                <Avatar
                  size={"xl"}
                  src={user.image}
                  alt="User Avatar"
                  css={{
                    border: "2px solid white",
                  }}
                />
              </Flex>
              <Box p={6}>
                <Stack spacing={0} align={"center"} mb={5}>
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={500}
                    fontFamily={"body"}
                  >
                    {user.username}
                  </Heading>
                  <Text color={"gray.500"}>*********************</Text>
                </Stack>
              </Box>
              <Button
                className="btn"
                w={"full"}
                mt={8}
                bg={useColorModeValue("#151f21", "gray.900")}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={() => sendFriendsRequest(user.id)}
              >
                Request
              </Button>
            </Box>
          </Center>
        ))}
      </h1>
    </div>
  );
};

export default Users;
