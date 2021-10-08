import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io-extended'
import Cookies from 'js-cookie'

export default ( {store} ) => {
    // Urgh. This is such a bodge. I'm so sorry.
    // Need the username/id from the cookie to pass to the 
    // Socket. But the socket would still get created/opened
    // if the user hasnt entered a name.
    
    // And with no way (that I know of) to close/open the socket again
    // I've had to resort to this fucking ugly way of doing things.

    // Redirects to /join, so the user can enter a name, and therefore
    // set a cookie. Reloads the page, so the socket can 
    // be opened with the correct details.

    const ud = Cookies.get("user");
    var userData = null;
    try {
        userData = JSON.parse(ud);
    }
    catch(e) {

    }

    if(!userData) {
        var currentUrl = window.location.href;        
        // need this here to stop infinite redirect happening.
        // Ask me how I know...
        if(!currentUrl.includes("/join"))
         {
            window.location.replace("/join");
         }        
    }
    else {

        store.commit("currentUser", userData);
        Vue.use(VueSocketIO, io(process.env.socketUrl,{
            query: {
                id: userData.id,
                username: userData.username
            }
        }), 
        {
            store,
            debug: true,
            actionPrefix: 'socket_',
            mutationPrefix: 'SOCKET_'
        })        
    }    
}