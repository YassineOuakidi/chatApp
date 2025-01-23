document.addEventListener('DOMContentLoaded' , async ()=> {
  await fetch('loggedInUser' ,{
    method: 'GET',
    headers :{
      'X-CSRFToken' : getCookie("csrftoken"), 
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('LoggedInUser' , data['username']);
    })
  await loadConversations();
 

  document.getElementById("new-message-form").addEventListener("submit",async  function(event) {
    event.preventDefault(); 
    await sendMessage(getMessageData() , localStorage.getItem('Actual_user'));
    document.querySelector('.message-content').value='';
    
  });
  const runConversationsTabLoader =  () => {
     loadConversations();
  };
  localStorage.setItem('currentConversationId' , 0);
  localStorage.setItem('currentData' , []);
  localStorage.setItem('lastMessageId' , -1);
  runConversationsTabLoader();

  setInterval(runConversationsTabLoader, 1000);
})
//////////////////load content///////////////////////////



async function loadConversationDisplay(messagesArray) {
  const conversationDisplay = document.getElementById('conversation-display');
  
  conversationDisplay.style.flexDirection = "column";
  conversationDisplay.style.flexWrap = "nowrap";
  conversationDisplay.innerHTML = ''; 
  let lastMessage;
  for (const message of messagesArray) {
      const messageElement = document.createElement('div');
      messageElement.style.width = "50%";
      if (message.sender == localStorage.getItem('LoggedInUser')) {
          messageElement.style.alignSelf = 'flex-end';
      } else {
          messageElement.style.alignSelf = 'flex-start';
      }
      messageElement.classList.add('message');
      messageElement.classList.add(message.sender === 'User1' ? 'sent' : 'received');
      
      const messageContent = `
          <div class="message-header">
              <strong>${message.sender}</strong> <small>${new Date(message.timestamp).toLocaleString()}</small>
          </div>
          <div class="message-body" style="word-wrap:break-word; overflow:hidden;">
              ${message.content}
          </div>
      `;
      messageElement.innerHTML = messageContent;

      conversationDisplay.appendChild(messageElement);
      lastMessage = messageElement;
  }
  if(!checkIfLastMessageAlreadyExists(messagesArray[messagesArray.length -1]["id"] )){
    lastMessage.scrollIntoView({
      behavior: 'smooth', 
      block: 'start'      
    });
    localStorage.setItem('lastMessageId' , messagesArray[messagesArray.length -1]["id"]);
  }
}

function checkIfLastMessageAlreadyExists(id){
  if(localStorage.getItem('lastMessageId') == id){
    console.log('ssssssss');
    return true;
  }
    
  else 
    return false;
}

function alreadyexists(data){
  let savedData = localStorage.getItem('currentData');
  if(savedData != []){
    if(savedData[savedData.length -1] == data[data.length-1] )
      return false;
    else 
      return true;
  } else {
    localStorage.setItem('currentData' , data);
    return true;
  }
}


async function loadConversation(id){
  await fetch('conversationMessages' , {
    method: 'POST',
    headers :{
      'X-CSRFToken' : getCookie("csrftoken"), 
      'Content-Type': 'application/json',
    },
    body : JSON.stringify({
      'conversation_id' : id,
    })
  })
    .then(response => response.json())
    .then(async data =>{
      if (alreadyexists(data)){
        await loadConversationDisplay(data)
      }
      
    })
    
  
}
let ConversationIntervalId;
function startLoadingConversation(id) {
  clearInterval(ConversationIntervalId);
  ConversationIntervalId = setInterval(async () => {
    await loadConversation(id);
  }, 1000);
}


////////////load conversations side bar////////////////////

async function  loadConversations(){
  let conversations;
  await fetch('getConversations' ,{
    method:'GET',
    headers:{
      'X-CSRFToken' : getCookie("csrftoken"), 
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data =>{
      conversations = data;
    })
  

  updateConversationsTab(conversations);
}

let items =[];

function updateConversationsTab(conversations){
  for(let i =0 ; i<conversations.length ; i++){
    if(items.includes(conversations[i]['id'])){

    } else {
      const conversation = document.createElement('li');
    conversation.className="list-group-item list-group-item-action";
    conversation.onclick = () =>{
      localStorage.setItem('Actual_user' , conversations[i]['user']);
      document.querySelector(".no-conversation-clicked-yet").style.display="none";
      document.querySelector(".conversation-clicked").style.display="flex";
      document.querySelector("#myForm").style.display ="block";
      startLoadingConversation(conversations[i]['id']);
      const conversationDisplayElement = document.getElementById("conversation-display");
      if (conversationDisplayElement) {
        conversationDisplayElement.scrollIntoView({
            behavior: 'smooth', 
            block: 'start'      
        });
        
      }
      localStorage.setItem('currentData' , []);
      localStorage.setItem('lastMessageId' , -1);
    };
    conversation.innerHTML = `${conversations[i]['user']}`;
    document.querySelector('.conversations-tab').append(conversation);
    items.push(conversations[i]['id']);
    }
  }
}

/////////////////send message/////////////////

function getMessageData() {

  myForm = document.querySelector("#new-message-form");
  myData = new FormData(myForm);
  return myData.get('message');
}


async function sendMessage(content , recipient){

  await fetch('sendNewMessage' ,{
    method : 'POST',
    headers :{
      'X-CSRFToken' : getCookie("csrftoken"), 
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      'recipient' : recipient,
      'content' : content,
    })
  })
    .then(response => response.json())
    .then(data => {
      loadConversation(data['id']);
    })
    
}




///////////////////////////////////////

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}