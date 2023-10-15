import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/index";
import { Grid, GridItem, Image, Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CardList = () => {
  const users = useSelector((state) => state.auth.users);
  const user = useSelector((state) => state.auth.userInfo);
  const [cards, setCards] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getCards();
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div>
      <div className="overlay">
        <video
          className="video"
          src="https://res.cloudinary.com/dv7ygzpv8/video/upload/v1697065075/videoB_zoubn9.webm"
          autoPlay
          loop
          muted
        ></video>
        <Navbar />
        <div className={`subNav ${scrolled ? "scrolled" : ""}`}>
          <button className="btnSub" onClick={() => navigate("/shop")}>
            FEATURED
          </button>
          <button className="btnSub" onClick={() => navigate("/cards")}>
            CARDS
          </button>
          <button className="btnSub" onClick={() => navigate("/shop/loot")}>
            LOOT
          </button>
          <button className="btnSub">ACCESSORIES</button>
        </div>
        <div>
          <Grid templateColumns="repeat(6, 1fr)" gap={3} p="100px">
            {cards?.map((card) => (
              <GridItem
                key={card.card_id}
                style={{ position: "relative", top: "30%" }}
              >
                <Box>
                  <Image src={card.card_image} alt={card.card_name} />
                </Box>
              </GridItem>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default CardList;
