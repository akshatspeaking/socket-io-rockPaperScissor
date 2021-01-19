const io = require("socket.io-client");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// write your code here

rl.question("Press Enter to Start", (firstMove) => {
  const socket = io("ws://localhost:3000/");

  function printAndPrompt(statusMsg) {
    console.log(statusMsg);
    rl.question("> ", (msg) => {
      printAndPrompt(`Sending move: "${msg}"`);
      socket.emit("move", `"${msg}"`);
    });
  }

  socket.on("move", printAndPrompt);
  socket.on("waiting", printAndPrompt);

  socket.on("win", printAndPrompt);
  socket.on("loss", printAndPrompt);
  socket.on("tie", printAndPrompt);

  socket.on("connect", () =>
    printAndPrompt("Connected to server. Enter your move..")
  );
  socket.on("disconnect", () => printAndPrompt("Connection lost..."));
});
