var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

let openMove = "";

io.on("connection", (socket) => {
  // check if any open move, if yes, calculate win and emit.

  // if not, save as open move and wait for player 2

  console.log(`Player ${openMove ? "2" : "1"} connected.`);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    openMove = "";
  });
  let moveEvent = "move";
  let winEvent = "win";
  let lossEvent = "loss";
  let tieEvent = "tie";
  let openEvent = "waiting";

  let broadcast = (msg) => {
    if (openMove) {
      if (openMove === msg) {
        io.emit(tieEvent, "Tie Game!");
        console.log("Tie Game!");

        openMove = "";
      } else {
        switch (openMove) {
          case "rock":
            if (msg === "paper") {
              // msg wins
              io.emit(winEvent, "Player 2 wins!");
              console.log("Player 2 wins!");
              //   console.log("You Won!");

              openMove = "";
            } else {
              io.emit(lossEvent, "Player 1 wins!");
              console.log("Player 1 wins!");

              //   console.log("You Lost!");

              openMove = "";
            }
            break;
          case "paper":
            if (msg === "scissor") {
              // msg wins
              io.emit(winEvent, "Player 2 wins!");
              console.log("Player 2 wins!");

              //   console.log("You Won!");

              openMove = "";
            } else {
              io.emit(lossEvent, "Player 1 wins!");
              console.log("Player 1 wins!");

              //   console.log("You Lost");

              openMove = "";
            }
            break;
          default:
            if (msg === "rock") {
              // msg wins
              io.emit(winEvent, "Player 2 wins!");
              console.log("Player 2 wins!");

              //   console.log("You Won!");

              openMove = "";
            } else {
              io.emit(lossEvent, "Player 1 wins!");
              console.log("Player 1 wins!");

              //   console.log("You Lost");

              openMove = "";
            }
            break;
        }
      }
      // msg loses
    } else {
      openMove = msg;
      //   console.log("Waiting for Player 2");

      io.emit(
        openEvent,
        "Move registered. You're Player 1. Waiting for player 2.."
      );
    }

    // socket.broadcast.emit(eventName, msg)
  };
  socket.on(moveEvent, (msg, ackFn) => {
    console.log("Move by Player " + (openMove ? "2: " : "1: ") + msg);
    // broadcast to other clients after 1.5 seconds
    setTimeout(broadcast, 1000, msg);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
  openMove = "";
});
