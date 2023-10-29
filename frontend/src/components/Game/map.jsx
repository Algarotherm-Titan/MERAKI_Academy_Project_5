import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCards } from "../redux/cardSlicer/card";
import { setUsers } from "../redux/authSlicer/auth";
import { setRoomId } from "../redux/cardSlicer/card";
import io from "socket.io-client";
import {
  Box,
  Heading,
  List,
  ListItem,
  Avatar,
  Text,
  VStack,
  Button,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import GameNavbar from "./onlineUser";

const socket = io("http://localhost:5001");

const Map = () => {
  const online = useSelector((state) => state.auth.onlineUsers);
  const userId = useSelector((state) => state.auth.userId);
  const users = useSelector((state) => state.auth.users);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomInvite, setRoomInvite] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(""); // State to store the generated roomId
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("room-invite", (selectedUserId, room) => {
      if (userId === selectedUserId) {
        setRoomInvite(true);
        setRoomIdInput(room);
        console.log("test for to ",room);
      }
    });
    socket.on("game-start", (roomIdInput) => {
      console.log("players-ready to fight ", roomIdInput);
      console.log("test", roomIdInput);
      dispatch(setRoomId(roomIdInput));
      navigate("/game");
    });
    const getCards = async () => {
      await axios
        .get(`https://backend-kxp7.onrender.com/card`)
        .then((res) => {
          dispatch(setCards(res.data));
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    
    getCards();
    return () => {
      socket.off("room-invite");
      socket.off("game-start");
    };
  }, [roomIdInput]);

  // Function to get user information by ID
  const getUserInfo = (userId) => {
    const user = users?.find((user) => user.id === userId);
    return user;
  };

  const generateUniqueRoomId = () => {
    let roomId = "";
    for (let i = 0; i < 4; i++) {
      roomId += Math.floor(Math.random() * 10);
    } // here we generate code with 4 numbers
    return roomId;
  };

  const handleSelectUser = (selectedUserId) => {
    const roomId = generateUniqueRoomId();
    setSelectedRoomId(roomId);
    socket.emit("user-selected", { selectedUserId, roomId, userId });
    // navigate("/game");
  };

  const handleJoinRoom = async (room) => {
    try {
      socket.emit("player-join", roomIdInput, selectedRoomId, userId);
      console.log("rooms",roomIdInput);

      // navigate("/game");
    } catch (err) {
      console.log(err.message);
    }
  };
  const otherOnlineUsers = online.filter((user) => user !== userId);

  return (
    <Box
      p={4}
      backgroundImage="url('https://cdn.vox-cdn.com/thumbor/C2by6pe1igejiwIDvhizLG5cOBI=/0x0:1775x931/2420x1613/filters:focal(746x324:1030x608)/cdn.vox-cdn.com/uploads/chorus_image/image/60472511/chrome_2018_07_24_11_40_50.0.jpg')" // Replace with the actual path to your background image
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      minHeight="100vh"
      backgroundColor={bgColor}
      color={textColor}
    >
      <GameNavbar />
      <List>
        {otherOnlineUsers?.map((selectedUserId) => {
          const user = getUserInfo(selectedUserId);
          return (
            <ListItem
              key={selectedUserId}
              display="flex"
              alignItems="center"
              mb={2}
              borderRadius="md"
              color="black"
              boxSize="100px"
              onClick={() => handleSelectUser(selectedUserId)} // Make the whole ListItem clickable
              style={{ cursor: "pointer" }} // Add a pointer cursor on hover
            >
              <VStack alignItems="center">
                <Avatar src={user?.image} alt={user?.username} size="xl" />
              </VStack>
            </ListItem>
          );
        })}
      </List>
      {roomInvite && (
        <Box mt={4}>
          <Button onClick={handleJoinRoom}>Join Room</Button>
          <Text fontWeight="bold">Room Invitation:</Text>
          {/* <Text>{roomInvite}</Text> */}
          {/* <Input
            type="text"
            placeholder="Enter Room ID"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            size="lg"
            variant="filled"
            mt={4}
          /> */}
        </Box>
      )}
    </Box>
  );
};

export default Map;
