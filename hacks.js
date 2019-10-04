// We only create the observer when the chat is loaded because the container
// element does not exist before that;
var observer;
var container;
// container element that we watch for new added nodes
var selector = '.blip-container';
// event triggered by each node added to the selector's matching element.
var node_added_evt = new CustomEvent('node-added', {node: null});
// triggerd by the last node added. When a bunch of mutations are sent in the
// same event it is the last added node of the last mutation.
var last_node_added_evt = new CustomEvent('last-node-added', {node: null});


function _getLastAddedNode(mutations){
  /*
    Returns the last added node in a list of mutations  that are captured
    by the mutation observer.
   */
  let idx = mutations.length - 1;
  while (idx >= 0){
    let mut = mutations[idx];
    if (mut.addedNodes){
      return mut.addedNodes[mut.addedNodes.length -1];
    }
    idx -= 1;
  }
  return false;
}

function _isClosedOptions(node){
  let sels = [
    '.blip-container .select',
    '.slideshow-container'
  ];

  let r = false;
  for (let sel of sels){
    try{
      if (node.querySelectorAll(sel).length){
	r = true;
	break;
      }
    }catch(e){
      // pass
    }
  }
  return r;
}


function OnDOMChange(mutations){
  // Dispatches node-added and last-node-added events;
  mutations.forEach(function(el){
    el.addedNodes.forEach(function(node){
      node_added_evt.node = node;
      container.dispatchEvent(node_added_evt);
    });
  });
  let last = _getLastAddedNode(mutations);
  if (last){
    last_node_added_evt.node = last;
    container.dispatchEvent(last_node_added_evt);
  }
}

function watchDOMChange(){
  let selector = '.blip-container';
  let node = document.querySelector(selector);
  console.debug('Watching DOM changes on ' + selector);
  let conf = {
    childList: true,
    subtree: true,
  };

  observer = new MutationObserver(OnDOMChange);
  observer.observe(node, conf);
  listenOnContainer();
}

function listenOnContainer(){
  container = document.querySelector(selector);

  container.addEventListener('last-node-added', function(e){
    console.debug(e.node);
    if (_isClosedOptions(e.node)){
      console.log('selectable');
    }
  });

}

window.addEventListener('message', function(message){
  if (message.data.code != 'UserIrisAccount'){
    return false;
  }
  watchDOMChange();
  return true;
});
