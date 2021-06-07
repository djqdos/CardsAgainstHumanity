<template>
    <div class="container" id="home-page">
        <Game />
        <Chat />
    </div>
</template>

<script>
import Chat from '../components/chat.vue'
import Game from '../components/game.vue'

export default {
    name: 'home',
    
    async mounted() {
        const userData = JSON.parse(localStorage.getItem("user"));

        if(!userData) {
            this.$router.replace("/join");
        }

        this.socket =  this.$nuxtSocket({
            name: 'main',
            query: {
                username: userData.username,
                id: userData.id
            }
        });               

    },

    methods: {
    },

    components: {
        Chat,
        Game
    }   
}
</script>
