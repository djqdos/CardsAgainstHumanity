<template>
    <div class="center-grid" id="game">

        <div v-if="!gameStarted">
            <input type="button" id="startGame" name="startGame" value="Start Game" @click="startGame" />
        </div>
        <div v-else>            
            <div v-if="AmIGameHost">
                You are the host <br />
                Selected Set: {{ gameSettings.selectedSet}}
                <br />
                <select name="sets" id="sets">
                    <option v-for="cardset in this.cards" :key="cardset">
                        {{ cardset }}
                    </option>
                </select>

                <input type="button" id="pickSetButton" name="pickSetButton" value="Pick Set" @click="pickset" />

                <input type="button" id="dealButton" name="dealButton" value="Deal Cards" @click="dealCards" />                
            </div>
            <div v-else>
                Game is has been started by {{ gameSettings.userWhoStartedGame.username}}<br />
                Selected Set: {{ gameSettings.selectedSet}}
            </div>            
        </div>


        <div v-if="cardsDealt">
            <div class="card black-card">
                {{ dealtCards.black.text }}
            </div>

            <div class="card white-card" v-for="whiteCard in dealtCards.white" :key="whiteCard.text">
                {{ whiteCard.text}}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "Game",
    data() {
        return {
            users: [],
            userData: {},

            cards: [],
            dealtCards: {},
            whiteCardsPerPlayer: 10,
            selectedSet: null,

            gameSettings: {
                gameStarted: false,
                userWhoStartedGame: {},
                selectedSet: ''
            },
        }
    },  
    
    computed: {
        gameStarted() {
            return this.gameSettings.gameStarted === true;
        },
        AmIGameHost() {
            return this.gameSettings.userWhoStartedGame.id === this.userData.id;
        },
        cardsDealt() {
            return Object.keys(this.dealtCards).length > 0;
        }
    },

    mounted() {       
        const ud = JSON.parse(localStorage.getItem("user"));
        this.userData = ud;
        if(!ud) {
            this.$router.replace("/join");
        }

        this.socket =  this.$nuxtSocket({
            name: 'main',
            query: {
                username: this.userData.username,
                id: this.userData.id
            }
        }); 


        // load the cards from the server
        //this.socket.emit("fetch-cards");

        this.socket.on("users", data => {
            this.users = data;
        });  
        
        this.socket.on("dealt-cards", data => {
            console.log("asdasdasdasdas");
            console.log("data = ", data);
            this.dealtCards = data;
        });

        this.socket.on("load-cards", data => {            
            console.log("loading cards from server");
            this.cards = data;
        });

        this.socket.on("game-started", data => {
            this.gameSettings.gameStarted = data.gameStarted;
            this.gameSettings.userWhoStartedGame = data.userWhoStartedGame;
        });

        this.socket.on("set-selected", data => {
            this.gameSettings.selectedSet = data;
        });
    },

    methods: {
        startGame() {
            this.socket.emit("start-game", this.userData);
            this.socket.emit("fetch-cards", this.userData);
        },

        pickset() {
            const chosenSet = document.getElementById(("sets")).value;                        
            const d = {
                userData: this.userData,
                chosenSet: chosenSet
            };
            this.socket.emit("pick-set", d);             
        },          
        dealCards() {            
            console.log("clicked");
            const d = {
                userData: this.userData,
                chosenSet: this.gameSettings.selectedSet
            };
            this.socket.emit("deal-cards", d);
        }        
    }
}
</script>
