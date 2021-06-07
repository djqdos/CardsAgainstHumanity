// load all the cards
const cards = require('../content/cards.json');

const options = {
    selectedSet: '',
    cardsPerPerson: 10,
    gameStarted: false,
    userWhoStartedGame: {}

}

function getSets() {
    return cards.map(x => x.name);
}

function getAllCards() {
    return cards;
}

function startGame(userWhoStartedGame) {
    options.gameStarted = true;
    options.userWhoStartedGame = userWhoStartedGame;
    
    return {
        gameStarted: options.gameStarted,
        userWhoStartedGame: options.userWhoStartedGame
    };
}




function getRandomBlackCard(setId) {
    const set = cards.filter(x => x.name == setId)[0];

    const min = 0;
    const max = set.black.length;
    const rnd = Math.floor(Math.random() * (max));
    return set.black[rnd];
}

function getRandomWhiteCards(setId, playerCount) {
    const set = cards.filter(x => x.name === setId)[0];
    let whiteCardCount = set.white.length;
    let tmpWhiteCards = set.white;
    let selectedWhiteCards = [];

    for(var i=1; i<= playerCount; i++) {

        for(var x =0; x < options.cardsPerPerson; x++) {
            const rnd = Math.floor(Math.random() * (whiteCardCount));
            const tmp = tmpWhiteCards.splice(rnd, 1);
            selectedWhiteCards.push(tmp[0]);
            whiteCardCount = tmpWhiteCards.length;
        }
    }

    return selectedWhiteCards;
}




function endGame() {
    options.gameStarted = false;

    return options.gameStarted;
}


module.exports = {
    getSets,
    getAllCards,
    startGame,
    endGame,
    getRandomBlackCard,
    getRandomWhiteCards

}