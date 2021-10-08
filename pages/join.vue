<template>
    <div class="center-grid" id="join-page">
        <div>
            <input type="text" name="name" id="name" placeholder="Name" required />            

            <input type="submit" name="submit" id="submit" value="Join" @click="join" />
        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'
export default {
    layout: 'default',
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
                Cookies.set("user", userData);
                window.location.replace("/home");
            }            
            //this.$router.push("/home");
        },

    }
}
</script>
