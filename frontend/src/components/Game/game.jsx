import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Center,
  Grid,
  Text,
  Flex,
  GridItem,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import GameNavbar from "./onlineUser";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("https://meraki-academy-project-5-socket.onrender.com");
import NavBar from "../Navbar";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
const Game = () => {
  const [isReady, setIsReady] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedCards, setSelectedCards] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [soketId1, setSocletId1] = useState("");
  const [soketId2, setSocletId2] = useState("");
  const [enamyCard, setEnamyCard] = useState([]);
  const [attackCards, setAttackCards] = useState([]);
  const [isCardSelectionAllowed, setIsCardSelectionAllowed] = useState(true);
  const [player1Hp, setPlayer1HP] = useState(0);
  const [player2Hp, setPlayer2HP] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRoundEnded, setIsRoundEnded] = useState(true);
  const [gameEndmessage, setGameEndMessage] = useState("");
  const [imogj, setImogj] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const users = useSelector((state) => state.auth.users);
  const cards = useSelector((state) => state.cards.cards);
  const userCard = useSelector((state) => state.auth.userCards);

  const navigate = useNavigate();
  const emoi = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEqqU7XZHsOKyFF96sXq21J8Z57OrLf9iBBLkIoLWjlRUFkw1yTw7QnWyCv3WtZAIZLsg&usqp=CAU",
    "data:image/jpeg;base64,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",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPxme6z_78fFqu8NEfS-nDonxhaON55d0_UF0r9d9n5vCNYX7_n_iyjgSpFYrofPF3kjc&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0cYoXdpH67sXfAqNzhEixhIQAsX5D9VKtpQ&usqp=CAU",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBESFRUSERURDxEREhgRERESEhERERARGBQZGRgUGRgcIS4lHB4rHxgYJjgmKy8xNTU1GiQ7QDszPy40NTEBDAwMEA8QGBISGjEkISE0MTQ0NDQxMTE0MTQxNDQ0NDQxNDQ0NDQ0NDQ0MTQxNDQ0NDQ0NDQ0PzQ0ND8/NDQ0Mf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABQMEBgIBB//EADkQAAICAQIEAwYEBQMFAQAAAAECAAMRBAUSITFBBlFhEyIycYGRI0JSoRQVYrHBcoLRM0NTY6IW/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIhEBAQEBAAICAgMBAQAAAAAAAAECEQMhEjFBUQQTIjJh/9oADAMBAAIRAxEAPwD7NCEIBCEIBCEIBCeZnJaB1mclpE9krtdCdWjZOGulJrpE10jN0vm+cm+LjdODfHU+Rp7eei+Kvbz0Xx0+RuLp2tsULfJUvjqzRqHncXJfJ0ulWVbhIleSAw09hCEAhCEAhCEAhCEAhCEAhCEAnhM8YyF3geu8rvbOLLJUstkZukr2yu9sheyQPZDndJntkLXSu9kp6nUYBk6xdJ9TuCp1IET6nxNQnWxB6cQJnzPxVuN73uju3Ap91QcDESoZc57OtZxdTvX19PFlB6OP3lvT+Iq2+F1PpkZnz7RqCvQdB2nGvRAM4A5E56R8Wr4b+K+r0bmp7y9XqQehnwnSb7qaj7rll/S3vDE2fh7xclhCP7j+R6H5GS5sYs1n7fTFulhLoi02qDDMvJZKs0cV3S0lkTV2y1XbDpNGwM9lSqyWVaVqV3CEIUQhCAQnOYQOoQhAJ4TAyGx4HljynZZPbXlO15GLRZZKrvPLHlZ3hzteu8hZ5y7yF3mWLRY8T7pqsAiG6bpXXyd1U+RIBmY1O5JYeTqR8xJXDy6snpm/FC/iK/6l5/SKa448QrxMmPIxfTpG65HWbzqTL6H8Tx7345yNHoPhHyEr7u/LA5lhgDvLGmDhc4XkPWMNmNbI9rcHtOE8PERhAPLPrF3JOx6teDeOfKcY67SuiLYw4eI8PCeTfPE60e232gvWjMF6sOWDPbtLqLHZ3y2SffY4XHpmOts3F9PWawUJPRuZ4fp3lt1z04/577anwZrLmrHtTkg8Knvgec2KWTA+FtWpXgAwyHJ5/Fk/FNrS/KY+nh7/AKsMq3lquyK0eWa3huU2qsl6qyJqnlymyadM02UzuVanlkGVuPYQhCuYQhA6hCeEwOGMp3PJ7nlC55GbUVrynY87teU7Hhytcu8gd567xZrNaqdTMuetcW3eU9TqgB1iPU74OgOflkyhZuIbmWwO+eUnXHXk/UJPFtbNYLOZBXA8gR2mcP2mk3fdUZCoUuP1dAD5iZ5XB+NT816zrm+vb1eG9zJqPa2JPM5x0yYyodR1YD5kSilWnPxvYvoEyZd0NdZbGnqa1x/3Lj7i+vDMakfR8P8AKnizyQx/icLkcKJ/5LOS/wC0dWip9wrTIrBY5ybH5/PhXoI4Xw3ZaeK1i5+yL6AdhO38HnHIjMzN5jl5v5evLfd9EH8arfGWJ9Z2tyHoR9eUl1W02UHDDI9ehkQoVx0+ncTrN/p5/k0fhuormw8g3JfUec2uj1AInzDT7hdRgA8adOFu3yM0W17/AFsQM8Lfpb/E53vevJqamrqz03iPJ0eJ9LrA0Y1vmOtZ1KYVvLtTxUjy3U806SnFLy9W8UUvGFDw65q7PZypnUrbmEIQOpw5ncgtaBWveL7nlm94vueRy1UNryo7Tu15TuswJlztV9dqeEGY7VXNe/CCQgOOX5jLu960n3F6ty+QlTTA8q6+bY94+Uxq+mMz5Xq9pttQD1+cg3HaEcHlGtG1gD3iSx6nJ6yeukgcLe9joe5E4Xdl9V04xH8nLAriU02a8sVCdD8R5LPoGn0mC3LqZaGkHlNf32LOx8/GwYIVjlm6gDkq+c023bWlagKAAP39TL9Wh99mPoB8hJdTywi9W5fITOvLdejtVi+OSDOO/aRWWWrzKhh5dI30+lCqPPzkhoBnP5Q4zd/BqEKkYcflPUTL6jSlSccmU/ebHd9uI/ETky8+Uz2of2h4sYbow9fOenxX9JSq6kOvLke48jFtuldeePqO002m0nE2AMlj09ZozsFIUcbcL459P7TpryZz9rLeMNtm/W0kCzLp6/EJudp3iu0cSNnzHcfMRRr/AA6n5Sr/ACBBiRtttofjrLIR2PQ+kTWdfTGsS+56r6jp7gZereYLZN94/df3HHVT39RNho9SGErOde+U6peMKHiil4w07zTtmm9TSeVKGloSuseQhCFemVb2llpS1BhKo3tF97S3eYvuMjjqqlrxPueq4VMYau0KDMluur4j15f3mK83l1ycn2WX2ZZmPYf3jrZFdeaVWWZ58SoTEel0T2MzOLMHoF5chNTtuqNYCF9SijkOZKict31x6PDJMyaX/wCI4fjruT/VWwEsIUfBQhs8uUvaXVORlbndfM4YfXMp8SK7ugDu+AxACoMegnmrrZnnpLXTJlrkCs56nHoJOjHvMVhE1fOK1sUO9jkAKcCPSuRjzGIo1O2sGR0dFCZzxrxDJ7485c39rJO+0lT6iz/oUu6/rb3V/eW02rWnm3sU9C+Yu1GpfGGuvtP6U9xfsIi1W4ICFItVmOAG4yWPp5zcnXTufqRp9RoNWgPEiWr34GBP2mI3Ok1ueJWTJ5qwKme63VvWQrJehIyMhl5Q0OdYwrax2I5lLCeID0zO+M/H2zrPffOGmxaB7PfXKJ+vHvN8pp6dIidFyf1N7xP3nCKK0CjChVwM9OUzep8YCtirJ0OM4ODON+W7eOc9NaVHkPtK2q09bjDqD9JkH8bD0+WDLe2+Jlub2Z5E9ORGY/q3PZ0r37axW3HXkDOQe6mWNg3c54HOGH/0POONcgsUg9e0xOoVq3yOTIcj/ierx35RjWevrOju4gDGtDTHeHdeLEVgeRH2PcTWadp0i4vTjTtLyxbpjGFcrvHUIQlaBlHUmXW6ShqIZpbeYs1L4EY6gxBu1/CpPkMzNcdXhBvu5cPujmx6D/MX6HToR7S1hz84uLm1y56E8vRRHWy7XXrGdnZhVUeBUU44j3JmNeoz48fKmuirVkexAFqrwC56M3kJMqKejAw1O0Wppn0uncGt+apZniRvMNMdadZpjixLFA/MMsp+onD4TX1Xo147mNtVpmGQpwG647y7TpgoxMPpfEzr1IPp3jejxUp6ic9eLTm1CVyT2YiLTeIFsZUUe8zBR6ZMs7ruZ0zmq0e9jiUjkGQ9DM/16/S/jpo2AJUsQMctlvTsPpEv/wCg4yFRS7Hoo5kyjb4jfnwgDtz7Szxav4TrT+6OwAEzeg8S1V22XWoHVARQeR4McsAeZPeKtVvNjggvwg+XKLmCstQGCCcH5idc+Hn/AE7+DltbN9BfuAe3VWrUFTjpqrKhVBGRxPMNrtK1bcdbOxrYcFqg8BPlmX9Nq2rcCziehGDPXkhW9Pl6R1uG/wBusBq0lKpQowcqvP69puS5v/j0ask9s5b4iusXhsY8uuOWfWQafTXak+4MJ+Z35KP+ZNum0vWubE4QejqcgH1EhTc7HRal5Y93lyHz9Z1zJ+Hk1Mz3E9ugoQcCfiOPisPb0AljatLixTj4cn9oUabhAHU9z5mN9Bp+AEnqf7S7vJxxt6us3KZfdUHEZpH5CZvc2yTOfh+yrfhDUlXes9D76/5n03RPkCfIdkfh1KeuR+0+s7b0E7X7Zz/0d6YxlVFmmjOqI9GXcIQlaeNKOoEvmUdSIZpRqZjfFVhFb/LE2mpExHi5D7N8fOZrz+RlNKcAn0lnwju/s7HrJ+NuNc9z3Eo1Ny+kTCtjaoUkHj5EdR6y876azePtWm1aWDkcHylhkBGCAR5HmJ8+0m5PXgWZOPzr/kR9o96z0YOPnz+0468PPp2z5v2a6jZdLZ8dVZ9QoB/aLNR4M0jfD7Ss/wBLHEv17uO4xJ13OuY+Oo6f2Yv2TaDwp/DuLKrm4l6cahxLW97JbrCjXXe9WCFZUAOD2MY/zKvzh/M6/OP9r8sEW3+FH09i2135dOahkBAMj1nhD2rvY1pQ2NxMqLwrk9cR+26V+ZkD7xX2yZZ8mbrEIG8E0j4ndvriVNb4U4F/AcjnnhfmCR0IPYzRWbmW+FfvIW1DvyP2HWany/KfPM+mE1LOEZX5WF8N/aazww6LVwDAZDz8znvK+9bEWR7z7nAA3Pq/MSttVnAhP6jG58sufk3dcMvENqlOH1mR2+tRaygdsj0zG2tv4z6SjtKceoc9lGJvE+OXLtPNPp+5l4CequJy74nPVuqK+rswJmta+TG+tt5GZ/U2dZ18eeIv+GqPaagN2rGT8z0n1bQLgCYbwhtxReJh7zniPoOwm/0qYxLb2mfd6ZaYRnXKGmEYJLHoj2EIStPTKuoWWpDcsJSXUrMvv+n4lYeYImu1KRJuVWQZmuG56fJ0BXKnqpIMraGv8YnyBMcb5p/Z2k9n5/XvFm2n8R/lNZYl9dbPa9nF6FicEch5GQarYLEPw5/qU4MfeG2Hs8d8xyADMa1ZXTOex8+FNyfnYDyYZna22jqFP3E3badT1AP0kZ0Nf6F+wk/sn6PgxX8RZ3Qfeei9z+TH1m1/ga/0CejR1j8i/aPnP0fBj0qtboplzTbRc3M4Ues1IQDsB9J7Jd9+iZKaNmUfGxPoOUYU6dE+FQPXvJZw7zPyta5CLxjqQtIrB961gMf0jmZky/CuPSXPE2r9pqCOq1jgHz6mK7HnTM9MavtW1mp4FJ/MeSj1l/w9WEXiPxMckxCG9o+fyg4Hyj/Tvwias9J9HZuEq6i6VjqJU1OokmGUGsvkG1aM32D9CHJ9T2EhVHtcVpzJ6nso8zN3se1rWoAHTqe5PnNW89Jb+Ib7VpeECPtOsp6ZMRlp0mY64zxd06y8sr0LLImnaPIQhCvROWE6EDAW6lIp1dfIzQXpFWprkrnuPm3izS5TiHWtuL6d5ktE2Lj/AFLPonihMV2H+kz5szcLo/lyPyjLzyfcfQdg1XDgHoZpUeYLQXcgR85o9DuXQN95N577bzrnpoFaeypXcD0MlDTjx1lTQkXFDik4vUhnDPOGcdzK92srXq01JUtTs8Xbhr1rUknmOglTV7rnkn3iHWWFupzOmcfmuet/omS02F3bq1jE/ecatsIzeQhWOF3r8zxj1E91acSOB1xN8Y/JZoOXOMhdFOlbkJZ9pNNWLzXym7s7BKxxMxwB5es506Pc3Cgz2LdhNlseyLWOmWPxMepmbrjFvPT3YNmFa8/edubt5ma3TVYkWmoAjCpJhc5TUJGOnSV6K4xoSad8xPWslngE9ldHMIQgeiewhA4YSjqa4xkNiZhLOvnPj0iug+bsFH+Zgtt21r3HL8NTl27H0E+z7zs1WoAFqcYU8QGcc4sfakReGtQijoAMCT6cN5s+nz62k0PjH4Z+E+XpLtb5jvX7cCCGGQZkHd6Hatuajmp7lZc676rjOn1eqdehlldzcRJVqw3eTiwGauY1NWGv83snL7rYfSLw0MyfGJ8qsPq3bqTImYnrOCwnJcSycO100rWTqzUqOpAlNtYpOFBc+koq6+gnFifGn7jykenvV/Rh8SnqJ3qC7dSEH3MXromdvw+Li/X0xJV7JPatrKfZvy+B+a+h7iMdv2ey3DWZRPL8zf8AEvjZr3XhYo/Qg4IYHzzNVtWgdUX2mC4HMjpMXX6NW2f5Q7XtSoAFUKB+8fUUgTqqrEt11ySGc8FVcu01zyquXqa5XbMSUVy6izitJLK6yOoQhCuYQhA6hCEAnhE9hAgtrzF99MayKyvMjNnWe1GmBmV3/ZBYOXJ15q3+PlN/dRKGo0ue0nHLWOvj1lXCeCwFHHccsyRFcfC4P+oT6BuOzJYMMob6cxM1qvDLKc1uVHk3MTc1+3GywqUX/wDrP1xJAt/9A/3T19s1SdOFvkcSMafVfpH3l+US1IKbT1dF+QzPH0v67G+QwIDR6o/pX6ztNjsb43PyEXUJYquKE7cZ/qJM59s78q04R54wI90vh9F54yfNucaU7Yo7TF1+jtv0yVG1O5BbJ9O00Gh2gDqI7r0gHQSylMz7v2Tx991To0gHaXa6pOlUnSqXjrMokrlqqqS10y3VVK6TLiqqXa64JXJ5W5ABPYQhoQhCBzCEIHUIQgEIQgE8xPYQI3TMrWUS5AiEsJ7NPKtmlHlHrViQvRJxm5Z59Cp7SBtuXymifTyFtPJxzuIQjQKO06GkHlHJ085/h44fArGnkgpjEaedDTxw+JetMlWmXlokyURxqZUkplhKZbSmSrXK1MoEplhUnYWdStceAT2EIUQhCAQhCB5iE9hAIQhAIQhAIQhAIQhAJ5iewgcFZya5LPMQITVPPYyfE9hOK/sZ6KpPCDiIVzoLO4QrwCewhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhA//2Q==",
  ];
  const userCardIds = userCard
    ? userCard.map((userCard) => userCard.card_id)
    : [];

  const UserCards = cards?.filter((card) => userCardIds.includes(card.card_id));

  const toggleReady = () => {
    if (!isButtonDisabled) {
      setIsReady(!isReady);
      setIsButtonDisabled(true);
      socket.emit("player-ready", userId);
    }
  };
  const toggleReady2 = () => {
    if (isRoundEnded) {
      setCurrentRound(currentRound + 1);
      setIsRoundEnded(false);
      console.log("test");
      if (soketId1) {
        socket.emit("next-round", soketId1);
      }
      if (soketId2) {
        socket.emit("next-round", soketId2);
      }
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };
  const getRandomCardNotInHand = () => {
    let randomCard;
    do {
      const randomIndex = Math.floor(Math.random() * UserCards.length);
      randomCard = UserCards[randomIndex];
    } while (playerHand.includes(randomCard));

    playerHand.push(randomCard);
    return randomCard;
  };

  useEffect(() => {
    socket.on("game_started", (socket_id) => {
      const shuffledUserCards = shuffleArray(UserCards);
      const initialHand = shuffledUserCards.slice(0, 2);
      setGameEndMessage("");
      setPlayerHand(initialHand);
      console.log("Game has started!");
    });

    socket.on("you-one", (data) => {
      setSocletId1(data);
      setPlayer1(userId);
      setPlayer1HP(20);
      setPlayer2HP(20);
    });
    socket.on("you-two", (data) => {
      setSocletId2(data);
      setPlayer2(userId);
      setPlayer2HP(20);
      setPlayer1HP(20);
    });

    socket.on("card-selected1", (card) => {
      setEnamyCard([...enamyCard, card]);
    });
    socket.on("card-selected2", (card) => {
      setEnamyCard([...enamyCard, card]);
    });
    socket.on("new-round", (card) => {
      setCurrentRound(currentRound + 1);
      setIsCardSelectionAllowed(card);
      setIsRoundEnded(card);
      setPlayerHand([...playerHand, getRandomCardNotInHand()]);
    });
    socket.on("you-win", (cardToRemove, result, secondplayer) => {
      if (soketId1) {
        setPlayer2HP(player2Hp - result);
        removePlayerFromEnamy(cardToRemove);
      } else if (soketId2) {
        setPlayer1HP(player1Hp - result);
        removePlayerFromEnamy(cardToRemove);
      }
    });
    socket.on("you-lose", (cardToRemove, result, secondplayer) => {
      if (soketId1) {
        setPlayer1HP(player1Hp - result);
        removeCardFromSelcted(cardToRemove);
      } else if (soketId2) {
        setPlayer2HP(player2Hp - result);
        removeCardFromSelcted(cardToRemove);
      }
    });
    socket.on("draw", (firstCard, secondCard, firstplayer, secondplayer) => {
      if (soketId1 === firstplayer) {
        removePlayerFromEnamy(secondCard);
        removeCardFromSelcted(firstCard);
      } else if (soketId1 === secondplayer) {
        removePlayerFromEnamy(firstCard);
        removeCardFromSelcted(secondCard);
      } else if (soketId2 === secondplayer) {
        removePlayerFromEnamy(firstCard);
        removeCardFromSelcted(secondCard);
      } else if (soketId2 === firstplayer) {
        removePlayerFromEnamy(secondCard);
        removeCardFromSelcted(firstCard);
      }
    });
    if (gameEndmessage) {
      navigate("/map");
    }
    if ((currentRound > 1 && player1Hp <= 0) || player2Hp <= 0) {
      socket.emit("end-game", player1Hp, player2Hp, soketId1, soketId2);
    }
    socket.on("game-over", (message) => {
      if (soketId1) {
        setGameEndMessage(message);
      } else if (soketId2) {
        setGameEndMessage(message);
      }
    });
    socket.on("game-done", (message) => {
      if (soketId1) {
        setGameEndMessage(message);
      } else if (soketId2) {
        setGameEndMessage(message);
      }
    });

    socket.on("get-imoj", (url) => {
      setImogj([...imogj, url]);
      console.log("hree work");

      setTimeout(function () {
        setImogj([]);
        console.log("pver");
      }, 3000);
    });
    if (attackCards.length === 2) {
      selectedCardsForAttacks();
    }
    if (userId === player1 && currentRound === 1) {
      setPlayerHand([...playerHand, getRandomCardNotInHand()]);
      console.log("work");
    }
    return () => {
      socket.off("game-started");
      socket.off("receive-cards");
      socket.off("you-win");
      socket.off("new-round");
    };
  }, [
    currentRound,
    isRoundEnded,
    enamyCard,
    player1Hp,
    player2Hp,
    selectedCards,
    gameEndmessage,
  ]);

  const removeCardFromSelcted = (cardToRemove) => {
    console.log("i am try to remove");
    setSelectedCards((prevHand) =>
      prevHand.filter((card) => {
        return card.card_id !== cardToRemove.card_id;
      })
    );
  };

  const removePlayerFromEnamy = (cardToRemove) => {
    setEnamyCard((prevHand) =>
      prevHand.filter((card) => {
        return card.card_id !== cardToRemove.card_id;
      })
    );
  };

  const removeCardFromHand = (cardToRemove) => {
    setPlayerHand((prevHand) =>
      prevHand.filter((card) => card !== cardToRemove)
    );
  };
  const handleCardSelect = (card) => {
    if (isCardSelectionAllowed) {
      if (player1 === userId && currentRound % 2 === 1) {
        if (!clickedCards.includes(card)) {
          setClickedCards([card]);
          setSelectedCards([...selectedCards, card]);
          removeCardFromHand(card);
          setIsCardSelectionAllowed(false);
          socket.emit("select-card1", card, soketId1);
        }
      } else if (player2 === userId && currentRound % 2 === 0) {
        if (!clickedCards.includes(card)) {
          setClickedCards([card]);
          setSelectedCards([...selectedCards, card]);
          removeCardFromHand(card);
          setIsCardSelectionAllowed(false);
          socket.emit("select-card2", card, soketId2);
        }
      }
    }
  };
  const selectedCardsForAttacks = () => {
    const [firstCard, secondCard] = attackCards;
    console.log("Attack with:", firstCard, secondCard);
    socket.emit("attack", firstCard, secondCard);
    setAttackCards([]);
  };

  const handleImageClick = (url) => {
    console.log("Image clicked", url);
    socket.emit("image-click", url, soketId1, soketId2);
  };
  const AttackCardStyle = {
    border: "2px solid lightblue",
  };

  return (
    <Box
      w="100%"
      h="100%"
      style={{
        backgroundImage: `url('https://static.invenglobal.com/upload/image/2020/01/22/i1579710522631687.png')`,
      }}
    >
      <GameNavbar />
      <div> {gameEndmessage}</div>
      <Grid>
        {Array.isArray(imogj) &&
          imogj.map((url) => (
            <Box key={url.length}>
              <Image
                src={url}
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
                boxShadow="md"
              />
            </Box>
          ))}
      </Grid>
      <Box
        backgroundImage="url('http://res.cloudinary.com/dv7ygzpv8/image/upload/v1696379431/qpavqpkecmeisxfpnsjr.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
      <Center h="100vh" flexDirection="column" alignItems="center">
        <Grid
          templateColumns={`repeat(auto-fill, minmax(px, 1fr))`}
          gap={80}
          css={{ gridAutoFlow: "column" }}
        >
          <GridItem
            pl="4"
            fontSize="30px"
            fontWeight="bold"
            lineHeight="80%"
            style={{
              cursor: "pointer",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              textAlign: "center",
              color: "#F0F8FF",
            }}
          >
            {`player1: ${player1Hp}`}
          </GridItem>
          <Grid></Grid>
          <GridItem
            pl="4"
            fontSize="30px"
            fontWeight="bold"
            lineHeight="80%"
            style={{
              cursor: "pointer",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              textAlign: "center",
              color: "#F0F8FF",
            }}
          >{`player2: ${player2Hp}`}</GridItem>
        </Grid>
        <Grid
          templateColumns={`repeat(auto-fill, minmax(px, 1fr))`}
          gap={5}
          css={{ gridAutoFlow: "column" }}
        >
          {enamyCard?.map((card) => (
            <Box
              key={card.card_id}
              onClick={() => {
                if (attackCards.length < 2 && !attackCards.includes(card)) {
                  setAttackCards([...attackCards, card]);
                }
              }}
              style={{
                cursor: "pointer",
                padding: "10px",
                border: attackCards.includes(card)
                  ? AttackCardStyle.border
                  : "1px solid #ccc",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <Image src={card?.card_image} maxW="150px" maxH="150px" />
              <Text fontSize="lg" fontWeight="bold" mt={2} color="#F0F8FF">
                {card.attack}
              </Text>
            </Box>
          ))}
        </Grid>
        <Box height="150px" />
        <Grid
          templateColumns={`repeat(auto-fill, minmax(px, 1fr))`}
          gap={5}
          css={{ gridAutoFlow: "column" }}
        >
          {selectedCards?.map((card) => (
            <Box
              key={card.card_id}
              onClick={() => {
                if (attackCards.length < 2 && !attackCards.includes(card)) {
                  setAttackCards([...attackCards, card]);
                }
              }}
              style={{
                cursor: "pointer",
                padding: "10px",
                border: attackCards.includes(card)
                  ? AttackCardStyle.border
                  : "1px solid #ccc",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <Image
                src={card.card_image}
                alt={card.card_name}
                maxW="150px"
                maxH="150px"
              />
              <Text fontSize="lg" fontWeight="bold" mt={2} color="#F0F8FF">
                {card.attack}
              </Text>
            </Box>
          ))}
        </Grid>

        <Text fontWeight="bold">Current Round: {currentRound}</Text>
        <Grid
          templateColumns={`repeat(auto-fill, minmax(px, 1fr))`}
          gap={2}
          css={{ gridAutoFlow: "column" }}
        >
          {playerHand?.map((card) => (
            <Box
              key={card && card.card_id}
              onClick={() => handleCardSelect(card)}
              style={{
                cursor: clickedCards.includes(card) ? "not-allowed" : "pointer",
                opacity: clickedCards.includes(card) ? 0.5 : 1,
                border: selectedCards.includes(card) ? "2px solid red" : "none",
                padding: "10px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <Image src={card && card.card_image} maxW="150px" maxH="150px" />
              <Text fontSize="lg" fontWeight="bold" mt={2} color="#F0F8FF">
                {card && card.attack}
              </Text>
            </Box>
          ))}
        </Grid>
        <Button mt={4} onClick={toggleReady}>
          {"Ready"}
        </Button>
        <Box height="10px" />
        {((player1 === userId && currentRound % 2 === 1) ||
          (player2 === userId && currentRound % 2 === 0)) && (
          <Button
            mt={4}
            onClick={toggleReady2}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              margin: "10px",
              position: "relative",
              left: "-300px",
            }}
          >
            End Round
          </Button>
        )}
        <Menu>
          <Box height="10px" />
          <MenuButton
            style={{
              cursor: "pointer",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              textAlign: "center",
              position: "relative",
              left: "-500px",
              top: "-300px",
              color: "#F0F8FF",
            }}
          >
            Open menu
          </MenuButton>
          <MenuList>
            <Grid
              templateColumns={`repeat(${emoi.length}, 200px)`}
              gap={10}
              justifyContent="flex-end"
            >
              {emoi.map((url) => (
                <MenuItem onClick={() => handleImageClick(url)}>
                  <Image
                    src={url}
                    boxSize="200px"
                    objectFit="cover"
                    borderRadius="md"
                    boxShadow="md"
                  />
                </MenuItem>
              ))}
            </Grid>
          </MenuList>
        </Menu>
      </Center>
    </Box>
  );
};

export default Game;
