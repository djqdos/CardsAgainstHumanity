import Cookies from 'js-cookie'
import cookie from 'cookie'

export const state = () => ({
    currentUser: {},
    users: [],    
    chatMessages:[],
    gameData: {
        gameStarted: false,
        host: null,
        setSelected: null, 
    },
    dealtCards: null,
    submittedChoice: []
});

export const mutations = {

    // set when user types in name
    currentUser(state, user) {
        state.currentUser = user;
    },

    // set via socket.io
    SOCKET_USERS(state, users) {
        state.users = users;
    },

    SOCKET_GAMEDATA(state, data) {
        state.gameData = data;
    },

    SOCKET_DEALTCARDS(state, data) {
        state.dealtCards = data;
    },

    SOCKET_MESSAGE(state, data) {
        state.chatMessages.push(data);
    },

    SOCKET_SUBMITTEDCHOICE(state, data) {
        state.submittedChoice.push(data);
    },

    SOCKET_RESETSUBMISSIONS(state, data) {
        state.submittedChoice = [];
    }
}
