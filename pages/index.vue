<template>
  <div class="container">
    <Chat />    
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';

import Chat from '../components/chat.vue'

export default {

  data() {
    return {
      sessionId: this.$store.state.sessionId
    }
  },

  async mounted() {                        
            // Startup
            this.socket = this.$nuxtSocket({
                name: 'main',  
                persist: 'mySocket',
                teardown: false,
                forceNew: false          
            });                    

  },

  methods: {

  },


  components: {
    Chat
  }
}
</script>
