const express = require("express");
const app = express();

const botUser = {
    username: "ChatBot",
    userId: "1"
};

const moment = require("moment");

const { formatMessage } = require("../serverUtils/messages");
const { userJoin, 
        getCurrentUser, 
        getUsers, 
        userLeaves,
        logUsers } = require("../serverUtils/users")

const { getSets, 
        getAllCards, 
        startGame,
        pickSet,
        getGameData,
        resetGameData,
        endGame,
        getRandomBlackCard,
        getRandomWhiteCards } = require('../serverUtils/cards')

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*:*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//     next();    
// });


//const server = http.createServer(app);
const server = app.listen(3001, () => {
    console.log("Listening on 3001");
});

const io = require("socket.io")(server, {
    cors: {
        //origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5500"],
        //origin: ["http://192.168.1.3:3000", "http://192.168.1.3:3001", "http://192.168.1.3:5500"],
        origin: "*",
        // credentials: true
    }
});

io.on("connection", (socket) => {
    // get id from socket handshake..
    const username = socket.handshake.query.username;
    const userId = socket.handshake.query.id;
    const user = {
        username: username,
        userId: userId
    };
    socket.join(userId);
    userJoin(userId, username, socket.id);

    io.to(userId).emit("message", formatMessage(botUser, `Welcome to the chat, ${username}!`));
    socket.broadcast.emit("message", formatMessage(botUser, `${username} has joined`));        
    io.emit("users", getUsers());
    

    socket.on("chat-message", data =>{                
        const msg1 = formatMessage(user, data);
        io.emit("message", msg1);
    });

    socket.on("private-message", (msg, privId) =>{ 
        const user = getCurrentUser(socket.id);
        io.to(privId).emit("message", formatMessage(user.username, msg, user.id));
    });    



    /* CARDS */    
    socket.on("start-game", () => {           
        const gameSettings = startGame(user);        
        io.emit("gamedata", gameSettings);
    });


    socket.on("fetch-cards", () => {        
        const c = getSets();    
        io.to(userId).emit("load-cards", getSets());
    });


    socket.on("pick-set", data => {        
        const sets = getSets();        
        const selectedSet = sets.filter(x => x === data)[0];
        const gameData = pickSet(selectedSet);        
        io.emit("gamedata", gameData);
    });

    socket.on("deal-cards", data => {
        
        const users = getUsers();        
        const gameData = getGameData();

        const blackCard = getRandomBlackCard(gameData.setSelected);
        const whiteCards = getRandomWhiteCards(gameData.setSelected, users.length);

        users.forEach((item, index) => {
            const userCards = {
                userId: item.id,
                userSocket: item.socketId,
                black: blackCard,
                white: whiteCards.splice(0, 10)
            };

            io.to(item.id).emit("dealtcards", userCards);
        });
    });


    socket.on("submitChoice", data => {
        io.emit("submittedchoice", data);
    });

    socket.on("reset-game-data", () => {
        io.emit("gamedata", resetGameData());
        io.emit("resetsubmissions", null)
        io.emit("dealtcards", null);
    });

    socket.on("end-game", () => {
        const gameEnded = endGame();
        io.emit("gamedata", gameEnded);
    });


    socket.on("disconnect", () => {
        const leftUser = userLeaves(socket.id);
        if(user) {
            io.emit("message", formatMessage(botUser, `${user.username} has left`));                        
        }        
        io.emit("users", getUsers());
    });
        
});

export default function(req, res, next) {
    next();
}