$(function () {
    //make connection
    var socket = io.connect('http://localhost:3000')

    //buttons and inputs
    var message = $("#message");
    var send_message = $("#send_message");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");
    var updated_name = $("#update_name");
    var name = $("#name");
    var myImage = $("#myImage");
    var list = $("#userlist");

    //Emit message
    send_message.click(() => {
        socket.emit("send_message", {
            message: message.val(),
            name: name.val()
        })
    })
    updated_name.click(() => {
        socket.emit("update_name", {
            name: name.val()
        })
    })
    socket.emit("user_connected");
    socket.emit("userlist");
    //Listen on new_message
    socket.on("broadcast_message", (data) => {
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>");
    });
    socket.on("broadcast_updated_name", (data) => {
        chatroom.append("<p class='message'>" + data.old_user + " is now " + data.username + " </p>");
    })
    socket.on("broadcast_user", (data) => {
        chatroom.append("<p class='message'>" + data.username + " connected </p>");
    })
    socket.on("broadcast_user_disconnect", (data) => {
        chatroom.append("<p class='message'>" + data.username + " disconnected </p>");
    })
    socket.on("broadcast_userlist", (data) => {
        list.empty();
        for (i = 0; i < data.length; i++) {
            list.append("<li>" + data[i] + "</li>")
        }
    })

});