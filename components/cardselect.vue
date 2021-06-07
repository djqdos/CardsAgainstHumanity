<template>
    <div class="card-select">

        <h1> users: </h1>
        <div v-for="user in users" :key="user.id">
            {{ user.id }} - {{ user.name}}
        </div>

        <select class="card-set" id="sets" name="sets">
            <option v-for="cardset in cards" :key="cardset.name">{{ cardset.name}}</option>
        </select>

        <input type="button" :disabled="cardsPicked" name="pickset" id="pickset" @click="pickset" value="Pick Set" />

        <input type="button" :disabled="cardsDealt" name="dealcards" id="dealcards" @click="dealCards" value="Deal Cards" />        

        <div class="cards" v-if="dealtCards">
            <div class="black-card-container">
                <div class="card black-card" v-if="dealtCards.black">{{ dealtCards.black.text}}</div>
            </div>

            <div class="white-card-container">
                <div class="card white-card" v-for="whiteCard in dealtCards.white" :key="whiteCard.text">
                    {{ whiteCard.text}}
                </div>
            </div>
        </div>



    </div>
</template>

<script>
import cards from '~/content/cards.json'

export default {
    name: "CardSelect",
    data() {
        return {
            cards: cards,
            dealtCards: {},
            whiteCardsPerPlayer: 10,
            selectedSet: null,
            users: []
        }
    },
    computed: {
        cardsPicked() {
            return this.selectedSet !== null;
        },
        cardsDealt() {
            return Object.keys(this.dealtCards).length > 0;
        }
    },
    mounted() {
            var that = this;
            this.socket = this.$nuxtSocket({
                name: 'main',
                persist: true
            });

            this.socket.on("user-cards", cardData => {
                console.log("user-cards socket = ", cardData);
                this.dealtCards = cardData;
            });

            this.socket.on("users", users => {
                console.log("users backend socket = ", users);
                this.users = users;
            });            
                 
    },
    methods: {
        pickset() {
            const chosenSet = document.getElementById(("sets")).value;                        
            const selectedSet = cards.filter(item => {
                return item.name === chosenSet;
            });            
            this.selectedSet = selectedSet;            
        },

        dealCards() {                        
            const blackCard = this.getRandomBlackCard(this.selectedSet);
            const whiteCards = this.getRandomWhiteCards(this.selectedSet, playerCount);
            
            this.users.forEach((item, index) => {
                const userCards = {
                    userId: item.id,
                    black: blackCard,
                    white: whiteCards.splice(index, 10)
                };

                console.group("User Cards");
                console.table(userCards);
                console.groupEnd();
            });            

        },

        getRandomBlackCard(set) {
            const min = 0;
            const max = set[0].black.length;
            const rnd = Math.floor(Math.random() * (max+1));            

            return set[0].black[rnd];
        },

        getRandomWhiteCards(set, playerCount) {
            const whiteCardsPerPlayer = 10;
            let whiteCardCount = set[0].white.length;
            const tmpWhiteCards = set[0].white;

            let selectedWhiteCards = [];
            for(var i= 1; i<=playerCount; i++) {
            
                for(var x=0; x<whiteCardsPerPlayer; x++) {
                    const rnd = Math.floor(Math.random() * (whiteCardCount+1));
                    const tmp = tmpWhiteCards.splice(rnd, 1);                                        
                    selectedWhiteCards.push(tmp[0]);
                    whiteCardCount = tmpWhiteCards.length;    
                }                
            }

            return selectedWhiteCards;
        },
    }
}
</script>
