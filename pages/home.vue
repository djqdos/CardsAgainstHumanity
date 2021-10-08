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
    layout: 'gamelayout',
    name: 'home',
    
    async mounted() {

    },

    methods: {
    },

    components: {
        Chat,
        Game
    }   
}
</script>
