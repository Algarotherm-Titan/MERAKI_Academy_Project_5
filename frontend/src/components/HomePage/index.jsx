import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import NavBar from "../Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Footer from "../Navbar/footer";
import { setRoomId } from "../redux/cardSlicer/card";
import { useNavigate } from "react-router-dom";
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
import { setCards } from "../redux/cardSlicer/card";
import io from "socket.io-client";
const socket = io("http://localhost:5001");

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [roomInvite, setRoomInvite] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = useSelector((state) => state.auth.userId);
  const posts = useSelector((state) => state.posts.posts);
  const token = useSelector((state) => state.auth.token);
  const [userToChat, setUserToChat] = useState("");
  const [messageText, setMessageText] = useState("");
  const [playerUserId, setPlayerUserId] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [sendr, setSendr] = useState([]);
  const [chatSendr, setChatSendr] = useState(null);
  const online = useSelector((state) => state.auth.onlineUsers);
  const users = useSelector((state) => state.auth.users);
  const [showButtons, setShowButtons] = useState(false);
  const formatTimestamp = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes}`;
  };
  const btnRef = useRef();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const otherOnlineUsers = online.filter((user) => user !== userId);
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
  const getCards = async () => {
    await axios
      .get(`http://localhost:5000/card`)
      .then((res) => {
        dispatch(setCards(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSelectUser = (selectedUserId) => {
    const roomId = generateUniqueRoomId();
    setSelectedRoomId(roomId);
    socket.emit("user-selected", {
      selectedUserId,
      roomId,
      userId,
      username: userInfo.username,
    });
  };

  const handleJoinRoom = async (room) => {
    try {
      socket.emit("player-join", roomIdInput, selectedRoomId, userId);
      console.log("rooms", roomIdInput);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    socket.on("room-invite", (selectedUserId, room, username) => {
      if (userId === selectedUserId) {
        setRoomInvite(true);
        setRoomIdInput(room);
        setPlayerUserId("");
        setPlayerUserId(username);
        console.log("test for to ", playerUserId);
      }
    });
    socket.on("game-start", (roomIdInput) => {
      console.log("players-ready to fight ", roomIdInput);
      console.log("test", roomIdInput);
      dispatch(setRoomId(roomIdInput));
      navigate("/game");
    });

    socket.on("chatMessage", (message, sender) => {
      console.log(message, sender);

      setChatMessages([...chatMessages, message]);
      setSendr([...sendr, sender]);
    });
    socket.on("chat-Message", (chats, userToChats, userID) => {
      if (userID === userId && userToChat === userToChats) console.log(chats);
      setChatSendr(userID);
      setChats((prevChats) => [...prevChats, chats]);
    });
    getCards()
    return () => {
      socket.off("room-invite");
      socket.off("game-start");
      socket.off("chat-Message");
    };
  }, [roomIdInput]);

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    fetchUsername();
    // getPosts();
    return () => {
      clearInterval(interval);
    };
  }, [currentImageIndex, posts, chatMessages, userId]);

  const getMessages = async (selectedUserId) => {
    let senderId = userId;
    let receiverId = selectedUserId;
    try {
      const response = await axios.get(
        `http://localhost:5000/chat/${senderId}/${receiverId}`
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
    console.log("prevImage: ");
  };
  const getPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts`, config);
      const rever = res.data.result;
      dispatch(setPosts([...rever].reverse()));
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const sendMessage = () => {
    if (message) {
      socket.emit("chatMessage", message, userInfo["username"]);
      setMessage("");
    }
  };

  // const sendFriendsRequest = async (reqsTo) => {
  //   try {
  //     const response = await axios.post(`http://localhost:5000/addFriends`, {
  //       reqsFrom: userId,
  //       reqsTo: reqsTo,
  //     });
  //     console.log("work");
  //     if (response.data.success) {
  //       // console.log(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const fetchUsername = async () => {
    try {
      const chatUserId = await getUsernameForChat();
    } catch (error) {
      console.error("Error fetching username:", error.message);
    }
  };
  const getUsernameForChat = () => {
    const user = users?.find((user) => user.id === userToChat);
    if (user) {
      return user.id;
    } else {
      return null; // User not found
    }
  };
  const chat = (selectedUserId) => {
    setIsOpen2(true);
    setUserToChat(selectedUserId);
    getMessages(selectedUserId);
  };
  const chatMessage = () => {
    console.log("chat-Message", messageText, userToChat, userId);
    socket.emit("chat-Message", messageText, userToChat, userId);
  };
  const sendMessages = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/chat`, {
        sender_id: userId,
        receiver_id: userToChat,
        message_text: messageText,
      });
      if (response) {
        chatMessage();
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <Notification />
      <div className="HomePage-container">
        <div className="background-vido1"></div>
        <div className="message">
          <ul className="news__tab__list">
            <li className="news__tab__item news__tab__item--active">message</li>
          </ul>
          <ul className="news__list">
            <div className="chat-messages">
              {chatMessages?.slice(0, 5).map((message, index) => (
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

              const toggleButtons = () => {
                setShowButtons(!showButtons);
              };

              return (
                <ListItem
                  key={selectedUserId}
                  display="flex"
                  alignItems="center"
                  mb={2}
                  borderRadius="md"
                  color="black"
                  boxSize="100px"
                  onClick={toggleButtons}
                  style={{ cursor: "pointer" }}
                >
                  <VStack alignItems="center">
                    <Avatar src={user?.image} alt={user?.username} size="xl" />
                  </VStack>
                  {showButtons && (
                    <div style={{ padding: "5px" }}>
                      <Button
                        m={"10px"}
                        size={{ base: "xs", md: "lg" }}
                        onClick={() => chat(selectedUserId)}
                      >
                        Open Chat Witth Friend
                      </Button>
                      <Button
                        m={"10px"}
                        size={{ base: "xs", md: "lg" }}
                        onClick={() => handleSelectUser(selectedUserId)}
                      >
                        Send Battle Request
                      </Button>
                    </div>
                  )}
                </ListItem>
              );
            })}
          </List>
        </div>
        {isOpen2 && (
          <div className="centered-content2">
            <div className="chatbox">
              {messages?.map((message) => (
                <div
                  key={message.message_id}
                  className={
                    message.sender_id === userId ? "sender" : "receiver"
                  }
                >
                  <div className="messageop">
                    <p className="messageText"> {message.message_text}</p>
                    <span className="messageText"> {message.timestamp}</span>
                  </div>
                </div>
              ))}
                {chats?.map((message, index) => (
                  <div
                    key={index}
                    className={chatSendr === userId ? "sender" : "receiver"}
                  >
                    <div className="messageop">
                      <p className="messageText">{message}</p>
                      <span className="messageTimestamp">
                        {formatTimestamp()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="inpute-button">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  width: "100%",
                }}
              ></input>
              <button className="send-button" onClick={() => sendMessages()}>
                Send
              </button>
              <button
                className="close-button"
                onClick={() => setIsOpen2(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="centered-content">
          {roomInvite && (
            <Box mt={4}>
              <Text fontWeight="bold">Game Invitation:{playerUserId}</Text>
              <Button onClick={handleJoinRoom}>Join Game</Button>
              <Button onClick={() => setRoomInvite(false)}>Ruffus</Button>
            </Box>
          )}
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
                    style={{ border: "1px solid #ccc", padding: "5px" }}
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
