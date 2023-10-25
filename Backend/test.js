const { Server } = require("socket.io");
// const server = http.createServer(app);
const io = new Server(5001, { cors: { origin: "*" } });

const connectedPlayers = new Map();

const connectedUsers = new Set(); //Set
const savedRoomIdInput = new Set();

const selectedCards = new Map();
const playRooms = {};

io.on("connection", (socket) => {
  socket.on("user-login", (userId) => {
    connectedUsers.add(userId);
    console.log("connected", Array.from(connectedUsers));
    connectedPlayers.set(userId, socket.id);
    console.log("connected", Array.from(connectedPlayers));
    io.emit("online-users", Array.from(connectedUsers));
  });
  socket.on("user-logout", (userId) => {
    connectedUsers.delete(userId);
    connectedPlayers.delete(userId, socket.id);
    io.emit("online-users", Array.from(connectedUsers));
    console.log("User disconnected:", userId);
  });

  socket.on("user-selected", ({ selectedUserId, roomId, userId }) => {
    console.log("User_selected", selectedUserId, roomId);

    try {
      const room = "room-" + selectedUserId + userId;
      playRooms[room] = { player1: "", player2: "" };
      console.log(playRooms[room]);

      socket.join(room);
      connectedUsers.clear();
      savedRoomIdInput.add(room)
      
      const selectedUserSocketId = connectedPlayers.get(selectedUserId);
      if (selectedUserSocketId) {
        // io.to(selectedUserSocketId).emit("room-invite", selectedUserId,room);

        io.emit("room-invite", selectedUserId, room);
        console.log("my work here over");
      } else {
        console.error("Selected user is not connected:", selectedUserId);
      }
    } catch (error) {
      console.error(
        "An error occurred while processing the user-selected event:",
        error
      );
    }
  });


  socket.on("player-join", async (roomIdInput, selectedRoomId, userId) => {
    try {
      console.log("player join", roomIdInput, userId, connectedPlayers);
      if (roomIdInput) {
        socket.join(roomIdInput);
        console.log("savedRoomIdInput:",savedRoomIdInput);
        
        //until here work
        console.log(Object.keys(playRooms[roomIdInput]));
        if (Object.keys(playRooms[roomIdInput]).length === 2) {
          // io.emit("game-start", connectedPlayers);
          io.to(roomIdInput).emit("game-start", roomIdInput);

          console.log("it is time to dual", roomIdInput);
        }
      }
    } catch (error) {
      console.error("Error while handling player join:", error);
    }
  });
  const firstValue = [...savedRoomIdInput.values()][0]

  socket.on("player-ready", (userId) => {
    console.log("Received player-ready event for user ID:", userId);

    const roomName = firstValue;
    console.log("roomName:",roomName);
    if (playRooms.hasOwnProperty(roomName)) {
      const room = playRooms[roomName];
      console.log("room work");

      if (Object.keys(room).length === 2) {
        const players = Object.keys(room);
        io.to(socket.id).emit("game_started", players);
      }
      console.log(Object.keys(room));
      if (Object.keys(room).length === 2) {
        const players = Object.keys(room);
        io.to(socket.id).emit("game_started", players);
      }
      if (room.hasOwnProperty("player1") && !room.player1) {
        room.player1 = socket.id;
      } else {
        room.player2 = socket.id;
      }
      io.to(room.player1).emit("you-one", room.player1);
      io.to(room.player2).emit("you-two", room.player2);
    }
  });

  socket.on("select-card1", async (card1, player1) => {
    try {
      console.log("card", player1);
      selectedCards.set(card1, player1);
      const roomName = firstValue;
      const room = playRooms[roomName];
      let player2Data = null;
      if (room.player2 && room.player2 !== player1) {
        player2Data = room.player2;
      }
      io.to(player2Data).emit("card-selected1", card1);
    } catch (err) {
      console.log(err.message);
    }
  });
  socket.on("select-card2", async (card2, player2) => {
    try {
      console.log("card", player2);
      selectedCards.set(card2, player2);
      const roomName = firstValue;
      const room = playRooms[roomName];
      let player1Data = null;
      if (room.player1 && room.player1 !== player2) {
        player1Data = room.player1;
      }
      io.to(player1Data).emit("card-selected2", card2);
    } catch (err) {
      console.log(err.message);
    }
  });
  socket.on("next-round", async (soketId) => {
    console.log("soketId", soketId);

    const roomName = firstValue;
    const room = playRooms[roomName];
    let player1Data = null;
    let player2Data = null;
    if (room.player1 && room.player1 !== soketId) {
      player1Data = room.player1;
      console.log("p1", player1Data);
      io.to(player1Data).emit("new-round", true);
    } else {
      player2Data = room.player2;
      console.log("p2", player2Data);

      io.to(player2Data).emit("new-round", true);
    }
  });
  socket.on("attack", async (firstCard, secondCard) => {
    console.log("new attack", firstCard);
    console.log(selectedCards);
    let firstplayer = null;
    let secondplayer = null;

    for (const [key, value] of selectedCards) {
      if (JSON.stringify(key) === JSON.stringify(firstCard)) {
        firstplayer = value;
      }
    }
    for (const [key, value] of selectedCards) {
      if (JSON.stringify(key) === JSON.stringify(secondCard)) {
        secondplayer = value;
      }
    }
    if (firstCard.attack > secondCard.attack) {
      let result = firstCard.attack - secondCard.attack;
      io.to(secondplayer).emit("you-lose", secondCard, result, secondplayer);
      io.to(firstplayer).emit("you-win", secondCard, result, secondplayer);
      console.log("win for ", firstplayer);
    } else if (secondCard.attack > firstCard.attack) {
      let result = secondCard.attack - firstCard.attack;
      io.to(firstplayer).emit("you-lose", firstCard, result, firstplayer);
      io.to(secondplayer).emit("you-win", firstCard, result, firstplayer);
      console.log("win for ", secondplayer);
    } else {
      io.to(secondplayer).emit(
        "draw",
        firstCard,
        secondCard,
        firstplayer,
        secondplayer
      );
      io.to(firstplayer).emit(
        "draw",
        firstCard,
        secondCard,
        firstplayer,
        secondplayer
      );
    }
    console.log("playerSoket", firstplayer, secondplayer);
  });
  socket.on("end-game", (player1Hp, player2Hp, soketId1, soketId2) => {
    if (soketId1 && player1Hp <= 0) {
      io.to(soketId1).emit("game-over", "you loset");
    } else if (soketId2 && player1Hp <= 0) {
      io.to(soketId2).emit("game-done", "you win");
    } else if (soketId2 && player2Hp <= 0) {
      io.to(soketId2).emit("game-over", "you loset");
    } else if (soketId1 && player2Hp <= 0) {
      io.to(soketId1).emit("game-done", "you win");
    }
  });
  socket.on("image-click", (url, soketId1, soketId2) => {
    const roomName = firstValue;
    console.log("imog", playRooms, "s1", soketId1, "s2", soketId2);
    const room = playRooms[roomName];

    if (room.player1 && room.player1 === soketId1) {
      io.to(room.player2).emit("get-imoj", url);
      console.log("we work here1 ");
    } else {
      io.to(room.player1).emit("get-imoj", url);
      console.log("we work here2 ");
    }
  });

  socket.on("chatMessage", (message, sender) => {
    console.log(message, sender);
    io.emit("chatMessage", message, sender);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
