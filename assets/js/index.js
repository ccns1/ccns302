let Peer = require('simple-peer')
let Clipboard = require('clipboard')
let p = new Peer({
  initiator: location.hash === '#1',
  trickle: false
})

let confirm_message = document.querySelector(".confirm_message")
let sender = document.querySelector(".sender")
let reciever = document.querySelector('.reciever')

p.on('error', (err) => {
  console.log('[!] There was an error: ', err)
})

p.on('signal', (data) => {
  sender.value = JSON.stringify(data)
})

document.querySelector('.connect').addEventListener('click', (e) => {
  e.preventDefault()
  the_msg.username = username.value.trim()
  p.signal(JSON.parse(reciever.value))
})

p.on('connect', () => {
  document.querySelector(".wrapper").classList.add("move_left")
})


// The clipboard functionality.
let clipboard = new Clipboard('.copy');

clipboard.on('success', (e) => {

  console.info('Text:', e.text);
  document.querySelector(".copy").innerHTML = "copied"
  sender.disabled = true
  e.clearSelection();

});

clipboard.on('error', (e) => {
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
});

//adding the messages chating
let send_btn = document.querySelector("button.send")
let msg = document.querySelector("textarea.msg")
let messages = document.querySelector(".messages")

let username = document.querySelector(".username")
let the_msg = {
  "username": "",
  "msg": ""
}
send_btn.addEventListener("click", () => {

  if (msg.value.trim() != "") {
    the_msg.msg = msg.value.trim()
    p.send(JSON.stringify(the_msg))
    messages.innerHTML += `<div class="msg m"><span class="username">${the_msg.username}:</span> ${the_msg.msg}</div>`
    document.querySelector(".second .messages").scroll(0, 10000000000)
  }

})

p.on('data', (data) => {
  message = JSON.parse(data)
  messages.innerHTML += `<div class="msg o">${message.username}: ${message.msg}</div>`
  document.querySelector(".second .messages").scroll(0, 10000000000)
})

// When the connectio is closed
p.on('close', () => {
  confirm_message.innerText = "The reciever left. Connection closed."
  alert("Connection closed.")
})

// When an exception raise
p.on('error', (err) => {
  confirm_message.innerText = "Error,.Connection closed."
  alert("There was an error. : " + err)
})

// If the user wants to close the connection.
document.querySelector("button.close").addEventListener("click", () => {
  p.destroy("Bye!")
})

// get chat type
function get_type() {
  radios = document.querySelectorAll("input.type")
  radios.forEach(r => {
    if (r.checked)
      return r.nextElementSibling.getAttribute("value")
  })
}