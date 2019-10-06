// The container element for the chat messages. It will be present
// in the DOM when the chat is  fully loaded.
var container;
var container_selector = '.blip-container';

window.addEventListener('message', function(message){
  // when the chat is loaded the parent document sends an UserIrisAccount
  // message.
  if (message.data.code != 'UserIrisAccount'){
    return false;
  }

  container = document.querySelector(container_selector);
  watchDOMChanges(container);

  // hide the button here 'cause we have a silly bug here. If we
  // don't hide it now the button will be always visible, not only when
  // we have some message to send
  let sendbtn = document.querySelector('#blip-send-message');
  sendbtn.style.display = 'none';
  return true;
});


/**
 * Watches for changes in a given node or in its child nodes.
 * When changes are detected the dispatchNodeEvents is called.
 * @param {Element} node - A DOM element to watch for changes.
 */
function watchDOMChanges(node){
  console.debug('Watching DOM changes on ' + container_selector);
  let conf = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  };

  let observer = new MutationObserver(dispatchNodeEvents);
  observer.observe(node, conf);
  listenOnNode(node);
}


/**
 * Dispatches `node-added` and `last-node-added` events when new nodes
 * are added.
 * @param {array} mutations - A list of mutations in the DOM.
*/
function dispatchNodeEvents(mutations){
  mutations.forEach(function(el){
    el.addedNodes.forEach(function(node){

      let node_added_evt = new CustomEvent('node-added');
      node_added_evt.node = node;
      container.dispatchEvent(node_added_evt);
    });
  });
  let last = _getLastAddedNode(mutations);
  if (last){
    let node = last['node'];
    let mutation = last['mutation'];
    let last_node_added_evt = new CustomEvent('last-node-added');
    last_node_added_evt.node = node;
    container.dispatchEvent(last_node_added_evt);
  }
}

/**
 * Listens to `last-node-added` event in a given node.
 * @param {Element} node - The node that dispatches the events.
 */
function listenOnNode(node){
  node.addEventListener('last-node-added', function(e){
    if (hasSelectableOptions(e.node)){
      disableInput();
    }else{
      enableInput();
    }
  });
}

/**
 * Checks if a node has selectable options on in.
 * @param {Element} node - A node to check.
 */
function hasSelectableOptions(node){
  let sels = [
    '.blip-container .select',
    '.slideshow-container'
  ];
  let r = false;
  for (let sel of sels){
    if (node.querySelector(sel)){
      r = true;
      break;
    }
  }
  return r;
}


/**
 * Disables the text input from the user so s/he has to select from
 * a list of options.
 */
function disableInput(){
  let msgarea = document.querySelector('#message-input');
  let textarea = document.querySelector('#msg-textarea');

  textarea.disabled = true;
  let style = 'background-color: #ccc';
  msgarea.style = style;
  textarea.style = style;
  textarea.placeholder = 'Escolha uma opção';
}

/**
 * Enables the text input so the user can write free text answers in the chat
 */
function enableInput(){
  let msgarea = document.querySelector('#message-input');
  let textarea = document.querySelector('#msg-textarea');
  textarea.disabled = false;
  let style = 'background-color: #fff';
  msgarea.style = style;
  textarea.style = style;
  textarea.placeholder = 'Digite sua mensagem aqui';
}


function _getLastAddedNode(mutations){
  // Returns the last added node in a list of mutations  that are captured
  // by the mutation observer.

  let idx = mutations.length - 1;
  while (idx >= 0){
    let mut = mutations[idx];
    if (mut.addedNodes.length){
      let node = mut.addedNodes[mut.addedNodes.length -1];
      // we ignore comment nodes because we only act upon the
      // message nodes.
      if (node.nodeName != "#comment"){
	return {node: node,
		mutation: mut};
      }
    }
    idx -= 1;
  }
  return false;
}
