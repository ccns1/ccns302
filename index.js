let Peer = require('simple-peer')
let Clipboard = require('clipboard')
let p = new Peer({ initiator: location.hash === '#1', trickle: false })

p.on('error', (err) => { console.log('[!] There was an error: ', err) })

p.on('signal', (data) => {
  document.querySelector('.my-id').value = JSON.stringify(data)
})

document.querySelector('.connect').addEventListener('click', (e)  => {
  e.preventDefault()
  the_msg.username = username.value.trim() 
  p.signal(JSON.parse(document.querySelector('.other-id').value))
})

p.on('connect',  () => {
  console.log('CONNECTED ....')
})


// The clipboard functionality.
let clipboard = new Clipboard('.copy');

clipboard.on('success', (e) => {
  console.info('Text:', e.text);
  document.querySelector(".copy").innerHTML = "copied"
  document.querySelector(".my-id").disabled = true
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
send_btn.addEventListener("click", ()=>{

  if( msg.value.trim() != "" ){
    the_msg.msg = msg.value.trim()
    p.send(JSON.stringify(the_msg))
    messages.innerHTML += `<div class="msg m">${the_msg.username}: ${the_msg.msg}</div>`
  }

})

p.on('data', (data) => {
  message = JSON.parse(data)
  messages.innerHTML += `<div class="msg o">${message.username}: ${message.msg}</div>`
})

// When the connectio is closed
p.on('close', () => {
  alert("Connection closed.")
})

// When an exception raise
p.on('error', (err) => {
  alert("There was an error. : " + err)
})

// If the user wants to close the connection.

document.querySelector("button.close").addEventListener("click", ()=>{
  p.destroy("Bae!")
})