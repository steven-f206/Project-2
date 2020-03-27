const socket = io.connect("http://localhost:1337");
//Eventually for heroku this will be:
//const socket = io.connect('HEROKU LINK HERE');

let output = $("#output");
let messagesend = $("#message");
let sendButton = $("#send");

sendButton.click(function() {
  socket.emit("chat", {
    messagesend: messagesend.val()
  });

  messagesend.val("");
});

socket.on("chat", function(data) {
  messagesend.empty();
  output.append(
    $('<p style="color: white; text-align: left;">').text(
      new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds() +
        " | " +
        data.messagesend
    )
  );
});
