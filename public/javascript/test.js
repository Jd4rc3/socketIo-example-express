const localUsers = [];
var socket = io(
  (options = { query: { userName: localStorage.getItem("userName") } })
);

function socketSetup() {
  var messages = document.getElementById("messages");
  var form = document.getElementById("form");
  var input = document.getElementById("input");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
      socket.emit("chat message", input.value);
      input.value = "";
    }
  });

  socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("writing", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("users", function (users) {
    const ulPeople = document.getElementById("people");

    for (let user of users) {
      if (!localUsers.includes(user)) {
        localUsers.push(user);
        var item = document.createElement("li");
        item.textContent = user.userName;
        ulPeople.appendChild(item);
      }
    }
  });
}

function getUserName() {
  if (localStorage.getItem("userName") == null) {
    let userName = prompt("What is your name?");

    localStorage.setItem("userName", userName);
  }
}

function showUserName() {
  let userName = localStorage.getItem("userName");

  var item = document.createElement("li");
  item.textContent = userName;

  document.getElementById("people").appendChild(item);
}

function emitWriting() {
  console.log("object");
  socket.emit("writing", socket.id);
}

getUserName();

socketSetup();
