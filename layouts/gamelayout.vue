<template>
  <div class="layout">

    <header>
      
        <img src="../assets/img/iconB.png" />

        <div class="user-list">
              <span class="user"                     
                    v-for="user in $store.state.users" :key="user.id"
                    :class="{ 'me': isMe(user.id), 'host' : isHost(user.id) }">
                  {{ user.username }}
              </span>
        </div>       
        
        <div style="text-align: center">
          <input type="button" @click="resetGameData" value="Reset Game Data" />
        </div> 
    </header>
    
    <Nuxt />
  </div>
</template>

<script>
export default {
   name: "gamelayout",
    computed: {
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
    },
    mounted() {      
   
        this.$socket.$subscribe("users", data => {
          console.log("FROM gamelayout.vue");
          console.table(data);
        });        
    },
    methods: {
       isMe(item) {
         console.log("item = ", item);

        if(this.$store.state.currentUser.id === item) {
          return true;
        }
      },

      isHost(item) {
          console.log("item = ", item);
          if(this.$store.state.gameData.gameStarted === true) {
              if(this.$store.state.gameData.host.userId === item) {
                  return true;
              }
              return false;
          }
          else {
              return false;
          }
      },
      resetGameData() {
        this.$socket.client.emit("reset-game-data");
      }
    }
}
</script>


<style scoped >

  header {
    display: grid;
    grid-template-columns: 4fr 4fr 3fr;
    gap: 1em;
  }

  img {
    height: 60px;
  }
</style>

