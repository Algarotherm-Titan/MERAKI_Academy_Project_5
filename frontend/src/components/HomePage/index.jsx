import React, { useEffect } from "react";
import AddPost from "../AddPost/index";
import Post from "../Post/index";
import Users from "../Friends/usres";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Heading,
  Container,
  Divider,
  VStack,
  Flex,
  Grid,
  GridItem,

} from "@chakra-ui/react";
import { setToggleProf, setUsers } from "../redux/authSlicer/auth";
import { getUserFriends } from "../redux/frinedSlicer/friends";

const HomePage = () => {
  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  dispatch(setToggleProf(false));

  const setUser = async () => {
    try {
      const result = await axios.get("http://localhost:5000/users/getAllUser");
      if (result.data) {
        dispatch(setUsers(result.data));
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const getUserFriend = async () => {
    try {
      console.log("Before axios request");

      const response = await axios.get(
        `http://localhost:5000/userFriends/${userId}`
      );
      console.log("After axios request", response.data.userFriends);

      if (response.status === 200) {
        dispatch(getUserFriends(response.data.userFriends));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setUser();
    getUserFriend();
  }, []);
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Home Page
      </Heading>
      <GridItem colSpan={1} >
            <AddPost />
          </GridItem>
      <Container maxW="100%">
        <Grid
          h="200px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={2} colSpan={1}>
            <Users userId={userId} />
          </GridItem>
          <GridItem colSpan={4} >
            <Post />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
