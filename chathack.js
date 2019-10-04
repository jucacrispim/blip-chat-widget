
function sendMsg(input){

  let usermsg = input.value + '<br/>';
  document.getElementById('msgs').innerHTML += usermsg;
  input.value = '';
  bp.widget.sendMessage(usermsg);

}

function doHack(){
  let openbtn = document.getElementById('blip-chat-open-iframe');
  let input = document.getElementById('msg-textarea');
  input.addEventListener("keypress", function(event) {
    console.log(event);
    if (event.key === "Enter") {
      event.preventDefault();
      sendMsg(input);
    }
});
  openbtn.style.display = 'none';
  openbtn.click();

}

window.addEventListener('message', function(...args){
  console.log(arguments);
  document.getElementById('user-msg').disabled = false;
  if (arguments[0].data.code != 'NewBotMessage'){
    return;
  }

  let msg = arguments[0].data.messageData.message;
  if (msg.toLowerCase().includes('escolha')){
    console.log('disabling input');
    document.getElementById('user-msg').disabled = true;
  }
});
