
$(function () {
   
    var socket = io.connect('http://localhost:3000')
    
    var message = $("#message")
    var usernamename = $("#usernamename")
    var send_message = $("#send_message")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")
    var send_username = $("#send_username")

    send_message.click(function () {
        socket.emit('new_message', { message: message.val() })
    })

    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append("<p class='message'>" + data.usernamename + ": " + data.message + "</p>")
    })

    send_username.click(function(){
        socket.emit('nickname', { usernamename : usernamename.val() })
        console.log(usernamename.val())
    })

   
});