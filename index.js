var Peer = require('simple-peer')
var ClipboardJS = require('clipboard')
var p = new Peer({ initiator: location.hash === '#1', trickle: false })

p.on('error', function (err) { console.log('[!] There was an error: ', err) })

p.on('signal', function (data) {
  document.querySelector('.my-id').value = JSON.stringify(data)
})

document.querySelector('.connect').addEventListener('click', function (e) {
  e.preventDefault()
  p.signal(JSON.parse(document.querySelector('.other-id').value))
})

p.on('connect', function () {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
})

p.on('data', function (data) {
  console.log('data: ' + data)
})

// The clipboard functionality.
let clipboard = new ClipboardJS('.copy');

clipboard.on('success', function(e) {
  console.info('Text:', e.text);
  document.querySelector(".copy").innerHTML = "copied"
  document.querySelector(".my-id").disabled = true
  e.clearSelection();
});

clipboard.on('error', function(e) {
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
});
