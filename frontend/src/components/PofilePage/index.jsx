import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import NavBar from "../Navbar";
import Friends from "../Friends";
import { FaCog as SettingsIcon } from "react-icons/fa";
import axios from "axios";
import { setCards } from "../redux/cardSlicer/card";
import { Grid, GridItem, Image, Box } from "@chakra-ui/react";

const ProfilePage = () => {
  const [div1Visible, setDiv1Visible] = useState(false);
  const [div2Visible, setDiv2Visible] = useState(false);
  const [div3Visible, setDiv3Visible] = useState(false);
  const dispatch = useDispatch();

  const cards = useSelector((state) => state.cards.cards);
  const userCard = useSelector((state) => state.auth.userCards);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userCardIds = userCard
    ? userCard.map((userCard) => userCard.card_id)
    : [];

  const UserCards = cards?.filter((card) => userCardIds.includes(card.card_id));

  const toggleDiv1 = () => {
    setDiv1Visible(!div1Visible);
    setDiv3Visible(false);
    setDiv2Visible(false);
  };

  const toggleDiv2 = () => {
    setDiv2Visible(!div2Visible);
    setDiv1Visible(false);
    setDiv3Visible(false);
  };

  const toggleDiv3 = () => {
    setDiv3Visible(!div3Visible);
    setDiv2Visible(false);
    setDiv1Visible(false);
  };
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
  useEffect(() => {
    getCards();
    console.log(UserCards);
  }, []);
  return (
    <>
      <NavBar />
      <div className="backg">
        <div class="grid-container">
          <div className="div1">
            <div className="cover-photo">
              <img
                className="cover"
                src="https://c4.wallpaperflare.com/wallpaper/753/398/573/digital-art-artwork-sekiro-shadows-die-twice-video-games-video-game-art-hd-wallpaper-preview.jpg"
              />
            </div>
            <div className="profile-picture">
              <img src={userInfo.image} alt="Profile Picture" />
            </div>
            <div class="spinner">
              <span>
                <h1 className="h1s">{userInfo.username}</h1>
              </span>
            </div>
            <div>
              <p className="dis">Sleep. Eat. Game. Repeat.</p>
            </div>
            <div class="parent">
              <div class="child child-2">
                <button class="button btn-2" onClick={toggleDiv2}>
                  <p>FRIENDS LIST</p>
                </button>
              </div>
              <div class="child child-3">
                <button class="button btn-3" onClick={toggleDiv3}>
                  <p>MY CARDS</p>
                </button>
              </div>
              <div class="child child-1">
                <button class="button btn-1" onClick={toggleDiv1}>
                  <p>OVERVIEW</p>
                </button>
              </div>
            </div>
          </div>

          <div className="div2">
            <Link to="/EditePage">
              <button className="setting">
                <SettingsIcon />
              </button>
            </Link>

            {div1Visible && (
              <div>
                <h1>OVERVIEW</h1>
              </div>
            )}

            {div2Visible && (
              <div className="div2Friend">
                <Friends />
              </div>
            )}

            {div3Visible && (
              <div>
                <h1 className="center">MY CARDS</h1>
                <div class="grid-container2">
                  <Grid templateColumns="repeat(10, 1fr)" gap={3} p="100px">
                  {UserCards?.slice(0, 40).map((card) => (
                      <GridItem
                        key={card.card_id}
                        style={{ position: "relative", top: "15%" }}
                      >
                        <Box>
                          <Image src={card.card_image} alt={card.card_name} />
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
