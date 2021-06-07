function formatPost(ud, data) {
    const formattedPost = {
        userdata: ud,
        post: data
    };

    return formattedPost;
}


module.exports = {
    formatPost
}