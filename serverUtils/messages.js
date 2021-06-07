const moment = require("moment");

function formatMessage(data) {
    return {
        userdata: data.userdata,
        text: data.post,
        time: moment().format("h:mm a")
    };
}

// function formatMessage(username, text, id) {
//     return {
//         username,
//         text,
//         id,
//         time: moment().format("h:mm a"),    
//     };
// }

module.exports = {
    formatMessage
};