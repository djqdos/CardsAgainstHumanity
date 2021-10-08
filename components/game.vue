<template>
    <div class="center-grid" id="game">        
        <input type="button" 
               id="startGame" 
               name="startGame" 
               value="Start Game" 
               @click="startGame" 
               v-if="!gameStarted"
               />

        <div v-if="gameStarted && !cardsDealt && !hasSubmitted">
            <div v-if="!cardsDealt">
                Game has Started!

                <div v-if="AmIGameHost">You are host!</div>
            </div>
            <div v-if="AmIGameHost && !cardsDealt && !hasSubmitted">
                <select name="sets" id="sets" v-if="!cardsDealt">
                    <option v-for="cardset in this.cards" :key="cardset">
                        {{ cardset }}
                    </option>
                </select>

                <input type="button" 
                       id="pickSetButton" 
                       name="pickSetButton" 
                       value="Pick Set" 
                       @click="pickset" 
                       v-if="!cardsDealt"
                       />
                
                <input type="button" 
                       id="dealButton" 
                       name="dealButton" 
                       value="Deal Cards" 
                       @click="dealCards" 
                       v-if="!cardsDealt" 
                       disabled                      
                       />  
            </div>

            <!-- Someone else is host -->
            <div v-else>
                <div v-if="!cardsDealt">
                {{ $store.state.gameData.host.username}} is host

                {{ $store.state.gameData.setSelected}}
                </div>
            </div>            
        </div>

        <LazyDealtCards v-if="cardsDealt" />

        <LazySubmissions v-if="hasSubmitted" />

    </div>
</template>

<script>

export default {
    name: "Game",
    
    data() {
        return {
            cards: []
        }
    },
    
    computed: {
        gameStarted() {
            return this.$store.state.gameData.gameStarted === true;
        },
        AmIGameHost() {
            if(this.$store.state.gameData.gameStarted === true) {
                if(this.$store.state.gameData.host.userId === this.$store.state.currentUser.id) {
                    return true;
                }
                return false;
            }
            else {
                return false;
            }
        },
        cardsLoaded() {
            return this.cards.length > 0;
        },
        cardsDealt() {            
            const user = this.$store.state.currentUser;
            const submissions = this.$store.state.submittedChoice;
            var hasSubmitted = false;
            if(submissions.length > 0) {
                var u = submissions.filter(x => x.user.id === user.id)[0];
                console.log("u = ", u);
                console.log("user = ", user.id);
                if(u) {
                    hasSubmitted = true;
                }
            }                                                

            console.log("hasSubmitted = ", hasSubmitted);

            return this.$store.state.dealtCards !== null && !hasSubmitted;
        },
        hasSubmitted() {
            const user = this.$store.state.currentUser;
            const submissions = this.$store.state.submittedChoice;
            var hasSubmitted = false;
            if(submissions.length > 0) {
                var u = submissions.filter(x => x.user.id === user.id);
                if(u) {
                    hasSubmitted = true;
                }
            }                                                
            return hasSubmitted;
        }
    },

    mounted() {       
        
        this.$socket.$subscribe("load-cards", data => {            
            console.log("loading cards from server");
            this.cards = data;
        });
    },

    methods: {
        startGame() {
            this.$socket.client.emit("start-game");
            this.$socket.client.emit("fetch-cards");
        },

        pickset() {
            console.log("sdfsfjhsdk");
            const chosenSet = document.getElementById(("sets")).value;                        
            if(chosenSet) {
                const dealButton = document.getElementById("dealButton");
                dealButton.disabled = false;
            }
            this.$socket.client.emit("pick-set", chosenSet);             
        },          
        dealCards() {                                    
            this.$socket.client.emit("deal-cards");
        },                
    },
    
}
</script>
