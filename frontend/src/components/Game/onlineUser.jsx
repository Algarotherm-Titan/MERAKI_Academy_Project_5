import React from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { SpinnerIcon, ArrowLeftIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, Flex, Avatar, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const socket = io("https://meraki-academy-project-5-socket.onrender.com");

const GameNavbar = () => {
  const userId = useSelector((state) => state.auth.userId);

  const handleButtonClick = () => {
    console.log("work");
    socket.emit("user-login", userId);
    console.log(userId);
  };
  // const userId = useSelector((state) => state.auth.userId);
  // const online = useSelector((state) => state.auth.onlineUsers);
  // const isLogged = useSelector((state) => state.auth.isLogged);
  // const dispatch = useDispatch();
  // dispatch(setToggleProf(false));
  // const setUserH = async () => {
  //   try {
  //     const result = await axios.get("http://localhost:5000/users/getAllUser");
  //     if (result.data) {
  //       dispatch(setUsers(result.data));
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // const getUserFriend = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/userFriends/${userId}`
  //     );

  //     if (response.status === 200) {
  //       dispatch(getUserFriends(response.data.userFriends));
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  // <footer style={{ backgroundColor: '#45524e', color: 'black' }}>
  //     <div className="container py-4">
  //       <div className="row">
  //         <div className="col-md-3">
  //           <h6 className="font-weight-bold">Company name</h6>
  //           <p>
  //             Here you can use rows and columns to organize your footer content.
  //             Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  //           </p>
  //         </div>

  //         <div className="col-md-2">
  //           <h6 className="font-weight-bold">Products</h6>
  //           <ul className="list-unstyled">
  //             <li>MDBootstrap</li>
  //             <li>MDWordPress</li>
  //             <li>BrandFlow</li>
  //             <li>Bootstrap Angular</li>
  //           </ul>
  //         </div>

  //         <div className="col-md-3">
  //           <h6 className="font-weight-bold">Useful links</h6>
  //           <ul className="list-unstyled">
  //             <li>Your Account</li>
  //             <li>Become an Affiliate</li>
  //             <li>Shipping Rates</li>
  //             <li>Help</li>
  //           </ul>
  //         </div>

  //         <div className="col-md-4">
  //           <h6 className="font-weight-bold">Contact</h6>
  //           <ul className="list-unstyled">
  //             <li><i className="fas fa-home mr-3"></i> New York, NY 10012, US</li>
  //             <li><i className="fas fa-envelope mr-3"></i> info@gmail.com</li>
  //             <li><i className="fas fa-phone mr-3"></i> + 01 234 567 88</li>
  //             <li><i className="fas fa-print mr-3"></i> + 01 234 567 89</li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>

  //     <hr className="my-3" />

  //     <div className="container">
  //       <div className="row align-items-center">
  //         <div className="col-md-7 text-center text-md-start">
  //           <div className="p-3">
  //             © 2023 Copyright:
  //             <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
  //           </div>
  //         </div>

  //         <div className="col-md-5 ml-lg-0 text-center text-md-end">
  //           <a className="btn btn-outline-light btn-floating m-1">
  //             <i className="fab fa-facebook-f"></i>
  //           </a>
  //           <a className="btn btn-outline-light btn-floating m-1">
  //             <i className="fab fa-twitter"></i>
  //           </a>
  //           <a className="btn btn-outline-light btn-floating m-1">
  //             <i className="fab fa-google"></i>
  //           </a>
  //           <a className="btn btn-outline-light btn-floating m-1">
  //             <i className="fab fa-instagram"></i>
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   </footer>
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


  return (
    <div className="wrapper">
      <div className="menu">
        <HStack spacing={8} alignItems={"center"}>
          <Box>Logo</Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            <Link className="Link" to="/HomePage">
              Homepage
            </Link>
          </HStack>
        </HStack>
      </div>
    </div>
  );
};

export default GameNavbar;
