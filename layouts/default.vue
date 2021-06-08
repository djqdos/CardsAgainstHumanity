<template>
  <div class="layout">

    <header>
        <h1>Cards Against Humanity</h1>  

        <!-- <div class="user-list">
              <span class="user" v-for="user in users" :key="user.id">
                  {{ user.username }}
              </span>
        </div> -->
    </header>


    
    <Nuxt />
  </div>
</template>

<script>


export default {
    data() {
        return {
            users: [],
            userData: {},
        }
    },  

    mounted() {
         const ud = JSON.parse(localStorage.getItem("user"));
         this.userData = ud;
        // if(!ud) {
        //     this.$router.replace("/join");
        // }

        this.socket =  this.$nuxtSocket({
            name: 'main',
            persist: 'mysocket',
            query: {
                username: this.userData.username,
                id: this.userData.id
            }
        }); 
        
        //this.socket = this.$nuxtSocket({ persist: "mysocket" });

        this.socket.on("users", data => {
            this.users = data;
            const cu = this.users.filter(x => x.id === this.userData.id)[0];
            if(cu) {
                this.socketId = cu.socketId;
            }            
        });        
    }
}
</script>


<style scoped >
  header {    
  }

  h1 {
      display: inline-block;
      margin-right: .5em;
      padding-right: .5em;
      border-right: 2px solid white;
    }

    .user-list {      
      display: inline-block;      
      height: 100%;
    }

    .user + .user:before {
      content: ', ';    
    }
</style>

