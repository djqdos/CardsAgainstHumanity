export const state = () => ({
    user: {},
    users: [],
    sessionId: ""
});

export const mutations = {
    setUser(state, user) {
        state.user = user;
    },

    updateUsers(state, users) {
        state.users = users;
    },

    setSocket(state, socket) {
        state.socket = socket;
    },

    setSessionId(state, uuid) {
        state.sessionId = uuid;
    },

    clearData(state) {
        state.user = {};
        state.users = [];
        state.socket = {};
    }
}

export const getters = {
    getUsers(state) {
        return state.users;
    },

    getUser(state, id) {                
        return state.users.filter(user => user.id === id)        
    }
}
