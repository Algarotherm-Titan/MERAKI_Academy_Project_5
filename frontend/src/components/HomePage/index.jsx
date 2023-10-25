import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import NavBar from "../Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Footer from "../Navbar/footer";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Grid,
  GridItem,
  Container,
  Heading,
  List,
  ListItem,
  Avatar,
  Text,
  VStack,
  
  Input,
} from "@chakra-ui/react";
import Notification from "../notificationx/index";
import { setPosts } from "../redux/postSlicer/post";
import { setUsers } from "../redux/authSlicer/auth";

import io from "socket.io-client";
const socket = io("https://meraki-academy-project-5-socket.onrender.com");

const HomePage = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = useSelector((state) => state.auth.userId);
  const posts = useSelector((state) => state.posts.posts);
  const token = useSelector((state) => state.auth.token);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [sendr, setSendr] = useState([]);
  const online = useSelector((state) => state.auth.onlineUsers);
  const users = useSelector((state) => state.auth.users);

  const btnRef = useRef();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const otherOnlineUsers = online.filter((user) => user !== userId);
  const getUserInfo = (userId) => {
    const user = users?.find((user) => user.id === userId);
    return user;
  };
  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % posts.length);
    console.log("nextImage: " + posts[currentImageIndex]?.image_url);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
    console.log("prevImage: ");
  };

  const setUser = async () => {
    try {
      const result = await axios.get("https://backend-kxp7.onrender.com/users/getAllUser");
      if (result) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPosts = async () => {
    try {
      const res = await axios.get(`https://backend-kxp7.onrender.com/posts/`, config);
      const rever = res.data.result;
      dispatch(setPosts([...rever].reverse()));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    getPosts();
    setUser();
    return () => {
      clearInterval(interval);
    };
  }, [currentImageIndex, posts, chatMessages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    socket.on("chatMessage", (message, sender) => {
      console.log(message, sender);

      setChatMessages([...chatMessages, message]);
      setSendr([...sendr, sender]);
    });
    return () => {
      socket.off("chatMessage");
    };
  });

  const sendMessage = () => {
    if (message) {
      console.log(message, userInfo["username"]);
      socket.emit("chatMessage", message, userInfo["username"]);
      setMessage("");
    }
  };

  const formatTimestamp = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes}`;
  };
  const sendFriendsRequest = async (reqsTo) => {
    try {
      const response = await axios.post(`https://backend-kxp7.onrender.com/addFriends`, {
        reqsFrom: userId,
        reqsTo: reqsTo,
      });
console.log("work");
      if (response.data.success) {
        // console.log(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <Notification />
      <div className="HomePage-container">
        <div className="background-vido1">
         
        </div>
        <div className="message">
          <ul className="news__tab__list">
            <li className="news__tab__item news__tab__item--active">message</li>
          </ul>
          <ul className="news__list">
          <div className="chat-messages">
                    {chatMessages.slice(0, 5).map((message, index) => (
                      <div key={index} className="chat-message">
                        <span className="sender">{sendr[index]}</span>
                        <p>{message}</p>
                        <span className="timestamp">{formatTimestamp()}</span>
                      </div>
                    ))}
                  </div>
          </ul>
        </div>
        <div className="onlineUsers">
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
              onClick={() => sendFriendsRequest(selectedUserId)} // Make the whole ListItem clickable
              style={{ cursor: "pointer" }} // Add a pointer cursor on hover
            >
              <VStack alignItems="center">
                <Avatar src={user?.image} alt={user?.username} size="xl" />
              </VStack>
            </ListItem>
          );
        })}
      </List>
        </div>
       
        <div className="chat">

          <div className="chat">
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              world
            </Button>
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Chat</DrawerHeader>
                <DrawerBody>
                  {" "}
                  <div className="chat-messages">
                    {chatMessages.map((message, index) => (
                      <div key={index} className="chat-message">
                        <span className="sender">{sendr[index]}</span>
                        <p>{message}</p>
                        <span className="timestamp">{formatTimestamp()}</span>
                      </div>
                    ))}
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                  />
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button colorScheme="blue" onClick={sendMessage}>
                    Send
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="background-vido2">
          
          <h1 className="posto">News</h1>
          <div className="posts">
            <ul className="news__tab__list">
              <li className="news__tab__item news__tab__item--active">News</li>
            </ul>
            <ul className="news__list">
              {posts.slice(0, 5).map((post) => (
                <li className="new-news" key={post.id}>
                  <p>{post.content}</p>
                  <p className="news_date">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="image-slider">
            <img
              src={posts[currentImageIndex]?.image_url}
              alt={`Image ${currentImageIndex}`}
            />
            <button onClick={prevImage} style={{ cursor: "pointer" }}>
              Previous
            </button>
            <button onClick={nextImage}>Next</button>
          </div>
        </div>
        <div className="background-video3">
          <video className="video3" autoPlay loop muted playsInline>
            <source
              src="https://res.cloudinary.com/dmhvb05w3/video/upload/v1697005486/fantasy-world-full-of-cherry-blossom-trees-moewalls-com_hhqymf.mp4"
              type="video/mp4"
            />
          </video>
          <h1 className="areass">Area</h1>
          <div className="areas">
            <div className="area1">
              <img
                src={
                  "https://i.pinimg.com/564x/92/d0/3d/92d03d0950503513c78bb9a559e80229.jpg"
                }
                alt="Area 1"
              />
            </div>
            <div className="area2">
              <img
                src={
                  "https://i.pinimg.com/564x/47/99/8d/47998d7dd1c6631ec0c34cbcac3ca672.jpg"
                }
                alt="Area 2"
              />
            </div>
            <div className="area3">
              <img
                src={
                  "https://i.pinimg.com/564x/41/18/4c/41184c5ab0f032de51da84c06dcb104c.jpg"
                }
                alt="Area 3"
              />
            </div>
            <div className="area4">
              <img
                src={
                  "https://i.pinimg.com/564x/4b/bb/ea/4bbbeaca0d9b6b30f9e9c5a2dd0e01c0.jpg"
                }
                alt="Area 4"
              />
            </div>
            <div className="area5">
              <img
                src={
                  "https://i.pinimg.com/564x/1a/6c/aa/1a6caa78202c778e46eb19ca7e9c3236.jpg"
                }
                alt="Area 5"
              />
            </div>
            <div className="area6">
              <img
                src={
                  "https://i.pinimg.com/564x/97/b0/c7/97b0c7e9714698538ab1fa5f3ea714d1.jpg"
                }
                alt="Area 6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
