const socket = io("http://localhost:5000");
let username = "";
const correctPassword = "pig@143";

function validateLogin() {
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    if (enteredPassword === correctPassword) {
        username = enteredUsername;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("chat-container").style.display = "block";
        socket.emit("join", username);
    } else {
        alert("Incorrect password. Please try again.");
    }
}

function sendMessage() {
    const message = document.getElementById("message").value;
    if (message) {
        socket.emit("sendMessage", { user: username, text: message });
        document.getElementById("message").value = "";
        socket.emit("stopTyping");
    }
}

function handleTyping() {
    socket.emit("typing", username);
    setTimeout(() => {
        socket.emit("stopTyping");
    }, 2000);
}

socket.on("receiveMessage", (data) => {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("p");
    messageElement.classList.add("message", data.user === username ? "user" : "other");
    messageElement.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("typing", (user) => {
    document.getElementById("typing").innerText = `${user} is typing...`;
});

socket.on("stopTyping", () => {
    document.getElementById("typing").innerText = "";
});

socket.on("onlineUsers", (count) => {
    document.getElementById("online-users").innerText = count;
});