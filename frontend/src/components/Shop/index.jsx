import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import NavBar from "../Navbar";
import { useNavigate } from "react-router-dom";
const Shope = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrolly, setScrolly] = useState(false);
  const [users, setUsers] = useState([]);
  const [imgCard, setImgCard] = useState([]);
  const user = useSelector((state) => state.auth.userInfo);
  const userId = useSelector((state) => state.auth.userId);
  const {
    isOpen: isOpenModal1,
    onOpen: onOpenModal1,
    onClose: onCloseModal1,
  } = useDisclosure();
  const {
    isOpen: isOpenModal2,
    onOpen: onOpenModal2,
    onClose: onCloseModal2,
  } = useDisclosure();
  const navigate = useNavigate();

  const userShop = users?.find((user1) => user?.id === user1?.id);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      if (window.scrollY > 350) {
        setScrolly(true);
      } else {
        setScrolly(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scrolly", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrolly", handleScroll);
    };
  }, []);

  useEffect(() => {
    setUser();
  }, []);

  const buyCommenCard = async (price) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/card/getRandomCards",
        {
          lootPrice: price,
          userId,
        }
      );
      setImgCard(response.data.image);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const slides = [
    {
      url: "https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697058244/runeterra-ionia-01_hkfdnl.jpg",
      name: "IONIA",
      title:
        "Surrounded by treacherous seas, Ionia is composed of a number of allied provinces scattered across a massive archipelago",
      image: "https://universe.leagueoflegends.com/images/iona_crest_icon.png",
    },
    {
      url: "https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697058405/runeterra-noxus-05_ronnnp.jpg",
      name: "NOXUS",
      title:
        "oxus is a powerful empire with a fearsome reputation. To those beyond its borders,",
      image: "https://universe.leagueoflegends.com/images/noxus_crest_icon.png",
    },
    {
      url: "https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697058471/runeterra-piltover-04_o2ia9i.jpg",
      name: "PILTOVER",
      title:
        "Piltover is a thriving, progressive city whose power and influence is on the rise.",
      image:
        "https://universe.leagueoflegends.com/images/piltover_crest_icon.png",
    },

    {
      url: "https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697058527/runeterra-demacia-01_ftmisb.jpg",
      name: "DEMACIA",
      title: "Astrong, lawful kingdom with a prestigious military history.",
      image:
        "https://universe.leagueoflegends.com/images/demacia_crest_icon.png",
    },
    {
      url: "https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697058605/runeterra-freljord-02_nshcon.jpg",
      name: "FRELJORD",
      title:
        "The Freljord is a harsh and unforgiving place—where the people are born warriors.",
      image:
        "https://universe.leagueoflegends.com/images/freljord_crest_icon.png",
    },
    {
      url: " https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697058680/runeterra-shadowisles-02_exbws1.jpg",
      name: "SHADOWISLES",
      title:
        "This cursed land was once home to a noble, enlightened civilization.",
      image:
        "https://universe.leagueoflegends.com/images/shadow_isles_crest_icon.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="shopC">
      <div className="overlay">
        <video
          className="video"
          src="https://res.cloudinary.com/dv7ygzpv8/video/upload/v1697065075/videoB_zoubn9.webm"
          autoPlay
          loop
          muted
        ></video>
        <NavBar />
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
          <div
            style={{
              right: "3%",
              position: "absolute",
              display: "flex",
              padding: "6px",
            }}
          >
            <img
              style={{ width: "60px", height: "30px" }}
              src="https://res.cloudinary.com/dv7ygzpv8/image/upload/e_background_removal/f_png/v1697103856/edfcb052357e8600e18d06f501f6be186d8c_1232xr706_Q100_pg18ht_-_Logo_xqyve4.png"
            />
            <span
              style={{
                color: "white",
                alignSelf: "center",
                fontSize: "22px",
              }}
            >
              {userShop?.crypto_amount}
            </span>
          </div>
        </div>
        <div className="firstSc">
          <div className="slider-large">
            <div
              style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
              className="slider-image"
            >
              <img className="iconImg" src={slides[currentIndex].image} />
              <p className="pName">{slides[currentIndex].name}</p>
              <p className="pTitle">{slides[currentIndex].title}</p>
            </div>
            <div className="slider-arrow left">
              <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>
            <div className="slider-arrow right">
              <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>
            <div className="slider-dots">
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={
                    slideIndex === currentIndex
                      ? "currentIndex"
                      : "slider-number"
                  }
                >
                  {slideIndex + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="slider-container1">
            <div className="slider-small">
              <div
                style={{
                  backgroundImage: `url(https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697099697/ionia-frame-35_zyzxbj.jpg)`,
                }}
                className="slider-image"
                onClick={onOpenModal1}
              >
                <p className="pName1">Bandles Cards</p>
                <img
                  className="iconImg1"
                  src="https://res.cloudinary.com/dv7ygzpv8/image/upload/e_background_removal/f_png/v1697103856/edfcb052357e8600e18d06f501f6be186d8c_1232xr706_Q100_pg18ht_-_Logo_xqyve4.png"
                />
                <span className="price">1000</span>
              </div>
            </div>
            <div className="slider-small">
              <div
                style={{
                  backgroundImage: `url(https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697100386/frel-lor-6_gquck6.jpg)`,
                }}
                className="slider-image"
              >
                <p className="pName1">Freljord Pack</p>
                <img
                  className="iconImg1"
                  src="https://res.cloudinary.com/dv7ygzpv8/image/upload/e_background_removal/f_png/v1697103856/edfcb052357e8600e18d06f501f6be186d8c_1232xr706_Q100_pg18ht_-_Logo_xqyve4.png"
                />
                <span className="price">500</span>
              </div>
            </div>
            <div className="slider-small">
              <div
                style={{
                  backgroundImage: `url(https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697100398/runeterra-demacia-03_me3rbs.jpg)`,
                }}
                className="slider-image"
              >
                <p className="pName1">Damacia Pack</p>
                <img
                  className="iconImg1"
                  src="https://res.cloudinary.com/dv7ygzpv8/image/upload/e_background_removal/f_png/v1697103856/edfcb052357e8600e18d06f501f6be186d8c_1232xr706_Q100_pg18ht_-_Logo_xqyve4.png"
                />
                <span className="price">500</span>
              </div>
            </div>
            <div className="slider-small">
              <div
                style={{
                  backgroundImage: `url(https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697100378/faction-shadowisles-frame-1_ekcekm.jpg)`,
                }}
                className="slider-image"
              >
                <p className="pName1">Shadowisles Pack</p>
                <img
                  className="iconImg1"
                  src="https://res.cloudinary.com/dv7ygzpv8/image/upload/e_background_removal/f_png/v1697103856/edfcb052357e8600e18d06f501f6be186d8c_1232xr706_Q100_pg18ht_-_Logo_xqyve4.png"
                />
                <span className="price">500</span>
              </div>
            </div>
          </div>
        </div>
        <Modal onClose={onCloseModal1} isOpen={isOpenModal1} isCentered>
          <ModalOverlay />
          <ModalContent
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697100398/runeterra-demacia-03_me3rbs.jpg)`,
            }}
          >
            <ModalHeader>Bandles Cards</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src="https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697065666/kwtrcfvd6p19tzgqxwxh.jpg"
                fallbackSrc=""
              />
              <Divider /> 5 Random Cards
            </ModalBody>
            <ModalFooter>
              <Button
                mr={40}
                variant="ghost"
                onClick={() => {
                  buyCommenCard(1000);
                  setUser();
                  onCloseModal1();
                  onOpenModal2();
                }}
              >
                <img
                  className="iconRp"
                  src="https://res.cloudinary.com/dv7ygzpv8/image/upload/e_background_removal/f_png/v1697103856/edfcb052357e8600e18d06f501f6be186d8c_1232xr706_Q100_pg18ht_-_Logo_xqyve4.png"
                />
                <span style={{ color: "rgb(255, 217, 0)" }}>1000</span>
              </Button>
              <Button colorScheme="blue" px={6} py={6} onClick={onCloseModal1}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {imgCard && (
          <Modal onClose={onCloseModal2} isOpen={isOpenModal2} isCentered>
            <ModalOverlay />
            <ModalContent
              style={{
                backgroundImage: `url(https://res.cloudinary.com/dv7ygzpv8/image/upload/v1697100398/runeterra-demacia-03_me3rbs.jpg)`,
                backgroundSize: "cover",
                maxWidth: "1300px",
              }}
            >
              <ModalHeader>Bandles Cards</ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                maxH="500px"
              >
                {imgCard?.map((imgC, i) => (
                  <Image src={imgC} fallbackSrc="" key={i} />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  px={6}
                  py={6}
                  onClick={onCloseModal2}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </div>
      <div className="overlay">
        <video
          className="video"
          src="https://res.cloudinary.com/dv7ygzpv8/video/upload/v1697065075/videoB_zoubn9.webm"
          autoPlay
          loop
          muted
        ></video>
        <div className="midSc">
          <div className="headerMid">
            <h4 style={{ fontSize: "12px", marginTop: "8px" }}>CATEGORY</h4>
            <h2>COMPETITIVE</h2>
          </div>
          <Divider w={"70%"} />
          <div className="list-item-M">
            <div className={`custom-list-item ${scrolly ? "scrolly" : ""}`}>
              <img
                src="https://images.contentstack.io/v3/assets/blta38dcaae86f2ef5c/blte6a6154d1e0276e7/643f3956a4989052e033750e/Kinkou-Student-Banner.jpg"
                alt="The First Runeterra Open"
              />
              <div className="item-details">
                <span className="date">4/19/23 09:00 PM</span>
                <span className="category">Competitive</span>
                <h3 className="title">The First Runeterra Open</h3>
                <p className="description">
                  This is a rundown of the first Runeterra Open, where we talk
                  about how we plan on improving tournaments for the future.
                </p>
              </div>
            </div>
            <div className={`custom-list-item ${scrolly ? "scrolly" : ""}`}>
              <picture className="card-banner-wrapper">
                <img
                  className="card-banner"
                  src="https://images.contentstack.io/v3/assets/blta38dcaae86f2ef5c/blt5c2b01a6a12f765d/64c190174855e94f9df9ac9a/HEADER_-_glory-in-navori_world-points.jpg"
                  alt="LoR Runeterra Points"
                />
              </picture>
              <div className="content-details">
                <span className="date">8/1/23 09:00 PM</span>
                <span className="category">Competitive</span>
                <h3 className="title">LoR Runeterra Points</h3>
                <p className="description">
                  Get a look at the current qualified players and point
                  standings for the Legends of Runeterra World Championship!
                </p>
              </div>
            </div>
            <div className={`custom-list-item ${scrolly ? "scrolly" : ""}`}>
              <picture className="card-banner-wrapper">
                <img
                  className="card-banner"
                  src="https://images.contentstack.io/v3/assets/blta38dcaae86f2ef5c/blt74988c7da460c720/63d1c6319d7bcb5422350296/013123_LoR_LS2023_Article_Banner.jpg"
                  alt="LoR Runeterra Points"
                />
              </picture>
              <div className="content-details">
                <span className="date">1/31/23 09:00 PM</span>
                <span className="category">Competitive</span>
                <h3 className="title">COMPETITIVE IN 2023</h3>
                <p className="description">
                  With our Refocus on PVP we’ve been hard at work designing and
                  refining new ways to make Competitive engaging. Check out this
                  Article to see how it will change in 2023!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shope;
