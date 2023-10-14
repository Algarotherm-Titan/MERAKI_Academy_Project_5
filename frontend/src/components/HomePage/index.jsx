import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import NavBar from "../Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Footer from "../Navbar/footer"
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
} from "@chakra-ui/react";
import Notification from "../notificationx/index";
import { setPosts } from "../redux/postSlicer/post";
import { setUsers } from "../redux/authSlicer/auth";
import io from "socket.io-client";
const socket = io("http://localhost:5001");

const HomePage = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const posts = useSelector((state) => state.posts.posts);
  const token = useSelector((state) => state.auth.token);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [sendr, setSendr] = useState([]);
  const btnRef = useRef();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
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
      const result = await axios.get("http://localhost:5000/users/getAllUser");
      if (result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const getPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/`, config);
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
  const  formatTimestamp=()=> {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes}`;
  }
  return (
    <>
      <NavBar />
      <Notification />
      <div className="HomePage-container">
        <div className="background-vido1">
          <video autoPlay loop muted playsInline>
            <source
              src="https://res.cloudinary.com/dmhvb05w3/video/upload/v1696968750/adventure-skyscape-moewalls-com_fxmgd9.mp4"
              type="video/mp4"
            />
          </video>

        <div className="message">
          <ul className="news__tab__list">
            <li className="news__tab__item news__tab__item--active">message</li>
          </ul>
          <ul className="news__list"></ul>
        </div>
          <div className="chat">
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              friend
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
                <DrawerHeader>Create your account</DrawerHeader>
                <DrawerBody></DrawerBody>
                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue">Save</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

          <div className="message">
            <ul className="news__tab__list">
              <li className="news__tab__item news__tab__item--active">
                message
              </li>
            </ul>
            <ul className="news__list"></ul>
          </div>


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
          <video autoPlay loop muted playsInline>
            <source
              src="https://res.cloudinary.com/dmhvb05w3/video/upload/v1697005514/fantasy-traditional-temples-sakura-moewalls-com_fseoqb.mp4"
              type="video/mp4"
            />
          </video>
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
              />
            </div>
            <div className="area2">
              <img
                src={
                  "https://i.pinimg.com/564x/47/99/8d/47998d7dd1c6631ec0c34cbcac3ca672.jpg"
                }
              />
            </div>
            <div className="area3">
              <img
                src={
                  "https://i.pinimg.com/564x/41/18/4c/41184c5ab0f032de51da84c06dcb104c.jpg"
                }
              />
            </div>
            <div className="area4">
              <img
                src={
                  "https://i.pinimg.com/564x/4b/bb/ea/4bbbeaca0d9b6b30f9e9c5a2dd0e01c0.jpg"
                }
              />
            </div>
            <div className="area5">
              <img
                src={
                  "https://i.pinimg.com/564x/1a/6c/aa/1a6caa78202c778e46eb19ca7e9c3236.jpg"
                }
              />
            </div>
            <div className="area6">
              <img
                src={
                  "https://i.pinimg.com/564x/97/b0/c7/97b0c7e9714698538ab1fa5f3ea714d1.jpg"
                }
              />
            </div>
          </div>
        </div>

    </div>
   
<Footer />
</> 
  
  );
};

export default HomePage;
