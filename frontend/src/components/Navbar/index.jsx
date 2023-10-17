import React, { useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setUser_id, setToggleProf } from "../redux/authSlicer/auth";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import io from "socket.io-client";
const socket = io("http://localhost:5001");

const NavBar = ({ users, getUserByID, getPostsByUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogged = useSelector((state) => state.auth.isLogged);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = useSelector((state) => state.auth.userId);
  const userss = useSelector((state) => state.auth.users);

  // none used

  const handleLogout = () => {
    if (userId) {
      socket.emit("user-logout", userId);
    }
    dispatch(setLogout());
  };

  useEffect(() => {
    if (!isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  return (
    <>
      {["xxl"].map((expand) => (
        <Navbar key={expand} expand={expand} id="id">
          <Container fluid>
            <Navbar.Brand href="#">
              <img className="img" src={""} alt="" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <img
                    className="img"
                    src={
                      "https://th.bing.com/th/id/OIP.GS_C63CDnQliyAmKAQEatwHaGD?pid=ImgDet&rs=1"
                    }
                    alt=""
                  />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/HomePage" className="font">
                    HOME
                  </Nav.Link>

                  <Nav.Link href="/CHARACTER" className="font">
                    CHARACTER
                  </Nav.Link>
                  <Nav.Link href="/News" className="font">
                    NEWS
                  </Nav.Link>
                  <Nav.Link href="" className="font">
                    TOP-UP
                  </Nav.Link>
                  {userInfo?.role_id === 2 && (
                    <Nav.Link className="font" href={"/Admin"}>
                      ADMIN
                    </Nav.Link>
                  )}
                  <Nav.Link
                    href="/ProfilePage"
                    className="font"
                    onClick={() => {
                      dispatch(setToggleProf(true));
                      dispatch(setUser_id(userInfo?.id));
                      getUserByID(userInfo?.id);
                    }}
                  >
                    PROFILE
                  </Nav.Link>

                  <Nav.Link href="shop" className="font">
                    SHOP
                  </Nav.Link>

                  {isLogged ? (
                    <Nav.Link onClick={handleLogout} className="logfont">
                      Logout
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
            {/* button */}
            <button
              id="button"
              className="game"
              onClick={() => {
                navigate("/map");
              }}
            >
              PLAY NOW
            </button>
          </Container>
        </Navbar>
      ))}
    </>
  );
};

export default NavBar;
