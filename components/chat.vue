<template>
    <div>
        <div class="chat-global-container">    
            <div class="chat-container">
                <div class="chat">
                    <div class="chat-message" 
                        v-anime="{opacity: 1, duration: 2000}"
                        v-for="(chatMessage, index) in $store.state.chatMessages" :key="index">
                        <span class="chat-name">{{ chatMessage.userdata.username}}</span>
                        <span class="time">{{ chatMessage.time }}</span>
                        <div class="msg">{{chatMessage.text}}</div>
                    </div>
                </div>
                <div class="message-container">
                    <input type="text" name="msg" id="msg" />
                    <input type="button" name="sendMsg" id="sendMsg" value="Send" @click="sendMsg" />
                </div>                  
                 
            </div>
        </div>
    </div>    
</template>

<script>
import { formatPost } from '../serverUtils/socketUtils.js';

export default {
    name: "Chat",
    mounted() {       

        this.$socket.$subscribe("join-message", data => {
            console.log("data = ", data);
            this.displayMessage(data);
        });

        this.$socket.$subscribe("message", data => {            
           // this.displayMessage(data);
        });
    },

    updated: function() {
        var chatBox = document.querySelector(".chat");
        chatBox.scrollTop = chatBox.scrollHeight;   
    },

    methods: {
        /* CHAT FUNCTIONS */
        sendMsg() {
            const msg = document.getElementById("msg").value;
            if(msg.length > 0) {
                this.$socket.client.emit("chat-message", msg);            
            }            
            document.getElementById("msg").value = "";
            document.getElementById("msg").focus();
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
    }
}
</script>
