<template>
    <div>
        <div class="chat-global-container">    
            <div class="chat-container">
                <div class="chat">

                </div>
                <div class="message-container">
                    <input type="text" name="msg" id="msg" />
                    <input type="button" name="sendMsg" id="sendMsg" value="Send" @click="sendMsg" />
                </div>  
                {{ socketId }}            
            </div>
        </div>
    </div>    
</template>

<script>
import { formatPost } from '../serverUtils/socketUtils.js';

export default {
    name: "Chat",
    data() {
        return {
            users: [],
            userData: {},
            socketId: ''
        }
    },    

    mounted() {       
        const ud = JSON.parse(localStorage.getItem("user"));
        this.userData = ud;
        if(!ud) {
            this.$router.replace("/join");
        }

        this.socket =  this.$nuxtSocket({
            name: 'main',
            query: {
                username: this.userData.username,
                id: this.userData.id
            }
        });          
        


        this.socket.on("message", data => {            
            this.displayMessage(data);
        });

        this.socket.on("users", data => {
            this.users = data;

            const cu = this.users.filter(x => x.id === this.userData.id)[0];
            if(cu) {
                this.socketId = cu.socketId;
            }            
        });
    },

    methods: {
        /* CHAT FUNCTIONS */
        sendMsg() {
            const msg = document.getElementById("msg").value;
            const postData = formatPost(this.userData, msg);
            this.socket.emit("chat-message", postData);
        },
        sendMsgPrivate() {
            const msg = document.getElementById("msg").value;
            const privId = document.getElementById("msgIdPrivate").value;
            this.socket.emit("private-message", msg, privId);
        },
        joinChat() {
            var chatContainer = document.querySelector(".join-container");
            var userName = document.getElementById("username");
            var joinButton = document.getElementById("joinChat");

            this.socket.emit("join-chat", userName.value);
            userName.disabled = true;
            joinButton.disabled = true;

            const maingameContainer = document.getElementById("maingame");
            const joinContainer = document.getElementById("joinContainer");

            joinContainer.style.display = "none";
            maingameContainer.style.display = "grid";

        },
        displayMessage(data) {
            console.log("displayMessage called");
            console.log("data = ", data);

            if(data.userdata && data.userdata.username && data.text) {
                var chatBox = document.querySelector(".chat");
                var newMessage = document.createElement("div");
                newMessage.classList.add("chat-message");
                var html = `<span class='chat-name'>${data.userdata.username}</span>`;
                html += `<span class='time'>${data.time}</span>`;            
                html += `<div class='msg'>${data.text}</div>`;
                newMessage.innerHTML = html;
                chatBox.append(newMessage);
                chatBox.scrollTop = chatBox.scrollHeight;            
            }
        },
        showUsers(data) {
            this.users = data;
        }
    }
}
</script>
