const express = require("express");
const app = express();
const botName = "ChatBot";
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
        endGame,
        getRandomBlackCard,
        getRandomWhiteCards } = require('../serverUtils/cards')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*:*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();    
});


//const server = http.createServer(app);
const server = app.listen(3001, () => {
    console.log("Listening on 3001");
});

const io = require("socket.io")(server, {
    cors: {
        //origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5500"],
        origin: ["http://192.168.1.3:3000", "http://192.168.1.3:3001", "http://192.168.1.3:5500"],
        credentials: true
    }
});
// io.set('close timeout', 60);
// io.set('heartbeat timeout', 60);
io.on("connection", (socket) => {
    
    // get id from socket handshake..
    const username = socket.handshake.query.username;
    const userId = socket.handshake.query.id;
    if(userId) {
        userJoin(userId, username, socket.id);
        socket.join(userId);

        const t= {
            userdata: {
                username: botName,
                id: 'x'
            },
            text: `Welcome to the chat, ${username}`,
            time: moment().format("h:mm a")
        };
        const msg = formatMessage(t);
        io.emit("join-message", t);
        
        io.emit("users", getUsers());
    }
    

    socket.on("test", () => {
        console.log("TEST");
    });

    socket.on("join-chat", username => {
        const user = userJoin(socket.id, username);    
        //socket.broadcast.emit("message", msg);        
        //io.to(user.id).emit("message", formatMessage(botName, `Welcome to the chat!`, user.id));
        io.emit("users", getUsers());
        
    });

    socket.on("chat-message", data =>{ 
        const user = getCurrentUser(socket.id);
        const msg1 = formatMessage(data);
        io.emit("message", msg1);
    });

    socket.on("private-message", (msg, privId) =>{ 
        const user = getCurrentUser(socket.id);
        io.to(privId).emit("message", formatMessage(user.username, msg, user.id));
    });    



    /* CARDS */    
    socket.on("start-game", ud => {        
        console.table(ud);
        
        const started = startGame(ud);
        io.emit("game-started", started);
    });

    socket.on("end-game", () => {
        const gameEnded = endGame();
        io.emit("game-ended", gameEnded);
    });


    socket.on("fetch-cards", ud => {
        const u = userJoin(userId, username, socket.id);
        console.log("fetching cards");  
        const c = getSets();
        console.table(c);
        io.to(socket.id).emit("load-cards", getSets());
    });


    socket.on("pick-set", data => {

        console.log("pick-set");
        console.table(data);

        const u = userJoin(data.userData.id, data.userData.username, socket.id);
        const sets = getSets();
        console.log("sets =", sets);
        const selectedSet = sets.filter(x => x === data.chosenSet)[0];
        console.log("picking set ", selectedSet);
        io.emit("set-selected", selectedSet);
    });

    socket.on("deal-cards", data => {
        const u = userJoin(data.userData.id, data.userData.username, socket.id);
        const users = getUsers();
        console.table(users);
        const chosenSet = data.chosenSet;
        
        const blackCard = getRandomBlackCard(chosenSet);
        const whiteCards = getRandomWhiteCards(chosenSet, users.length);

        users.forEach((item, index) => {
            const userCards = {
                userId: item.id,
                userSocket: item.socketId,
                black: blackCard,
                white: whiteCards.splice(0, 10)
            };

            console.log("User cards for: ", item.username);
            console.table(userCards);

            io.to(item.id).emit("dealt-cards", userCards);
        });
    });





    socket.on("disconnect", () => {
        const user = userLeaves(socket.id);
        if(user) {
            io.emit("message", formatMessage(botName, `${user.username} has left`));            
        }        
        io.emit("users", getUsers());
    });
    

    
});

export default function(req, res, next) {
    next();
}

