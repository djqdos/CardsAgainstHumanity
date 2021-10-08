const moment = require("moment");

function formatMessage(user, data) {
    return {
        userdata: user,
        text: data,
        time: moment().format("h:mm a")
    };
}

module.exports = {
    formatMessage
};