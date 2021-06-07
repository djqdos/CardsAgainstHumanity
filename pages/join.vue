<template>
    <div class="container" id="join-page">
        <input type="text" name="name" id="name" placeholder="Name" required />

        <!-- <input type="text" name="room" id="room" placeholder="Room ID" /> -->

        <input type="submit" name="submit" id="submit" value="Join" @click="join" />
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
    name: 'join',

    mounted() {

    },

    methods: {
        join() {                        
            const username = document.getElementById("name").value;
            const newId = uuidv4();

            const userData = {
                username: username,
                id: newId
            };
            
            if(process.browser) {
                localStorage.setItem("user", JSON.stringify(userData));
            }            
            this.$router.push("/home");
        },

    }
}
</script>
