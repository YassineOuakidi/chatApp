document.addEventListener('DOMContentLoaded', () => {
    const runInvitationCounter = async () => {
      await InvitationCounter();
    };
    
    runInvitationCounter();
  
    setInterval(runInvitationCounter, 1000);
  });

//////////////////////////////////FRIENDS LIST////////////////////////




function removeFriendListPopUp(){
    document.querySelector('.friend-list-container').remove();
}


async function makeHTMLForFriendList(data){
    let listContainer = document.createElement('div');
    
    for (let i = 0; i < data.length; i++) {
        let listItem = document.createElement('div');
        listItem.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';
        
        listItem.innerHTML =`
                <span style="flex-grow : 1 ; color:white;">${data[i].username}</span>
                <button onclick="sendMessage('${data[i].username}')" style="font-size:20px;margin-left: 10px; color : green ; border:none ; background-color:black;">Send Message Now!</button>
        `;
        
        listContainer.appendChild(listItem);
    }

    return `
        <div class="container-fluid text-end mb-3 pt-3" onclick="removeFriendListPopUp()">
            <button class="btn btn-danger btn-sm rounded-circle" style="border: none;">X</button>
        </div>
        <div class="container-fluid">
            ${listContainer.innerHTML}
        </div>
    `;
    

}



async function showFriendsList(){
    if(document.querySelector('.friend-list-container')!= null){
        document.querySelector('.friend-list-container').remove();
    }
    
    let friends;
    await fetch('getFriendsList' , {
        method: 'GET',
        header :{
            'X-CSRFToken' : getCookie('csrftoken'),
            'Content-Type' : 'application/json',
        }
    })
        .then(response => response.json())
        .then (data =>{
            friends = data;
        })
    
        const friendsListContainer = document.createElement('div');
        friendsListContainer.className = 'container-fluid friend-list-container';
        
        friendsListContainer.style = `
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 600px;
            overflow-y: auto;
            background-color: black;
            z-index: 1000;
            border-radius: 2em;
            border : 2px solid cadetblue;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            opacity:0.8;
        `;
        
        friendsListContainer.innerHTML=`
            <div style="align-self:flex-end; "><button>X</button></div>
        `;
        let friendListHTML = await makeHTMLForFriendList(friends);
        friendsListContainer.innerHTML = friendListHTML;
    
        document.querySelector('body').append(friendsListContainer);
}







//////////////////////////////////INVITATION/////////////////////////////

async function InvitationCounter(){
    await fetch('numberFriendsRequests' , {
        method:'GET',
        headers : {
            'X-CSRFToken': getCookie("csrftoken"),
            'Content-Type': 'application/json',
        },
    })
        .then(response=>response.json())
        .then(data =>{
            
            document.querySelector('#friendsRequestNumber').innerHTML=`(${data['number']})`;
        })
}



function removeFriendRequestPopUp(){
    document.querySelector('.friend-request-container').remove();
}


async function rejectInvitationByUsername(username){
    await fetch('rejectInvitation',{
        method : 'POST',
        headers : {
            'X-CSRFToken': getCookie("csrftoken"),
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            'username' : username,
        })
    })
        .then(response => response.json())
        .then(data=>{
            console.log(data);
        })
    await showFriendsRequest();
    await InvitationCounter();
    await loadConversations();
}



async function acceptInvitationByUsername(username){
    await fetch('acceptInvitation' ,{
        method: 'POST',
        headers:{
            'X-CSRFToken': getCookie("csrftoken"),
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            'username' : username,
        })
    })
        .then(response => response.json())
        .then(data=>{
            console.log(data);
        })
    await showFriendsRequest();
    await InvitationCounter();
    await loadConversations();
}



async function makeHTMLForFriendRequest(data){
    let requestContainer = document.createElement('div');
    
    for (let i = 0; i < data.length; i++) {
        let requestItem = document.createElement('div');
        requestItem.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border : 3px solid white; border-radius : 2em;';
        
        requestItem.innerHTML =`
                <span style="flex-grow : 1 ; color:white; margin-left:30px">${data[i].username}</span>
                <button onclick="acceptInvitationByUsername('${data[i].username}')" style="font-size:40px;margin-left: 10px; color : green ; border:none ; background-color:black;">✓</button>
                <button onclick="rejectInvitationByUsername('${data[i].username}')" style="font-size:40px;margin-left: 10px; color : red ; border:1px solid black ;margin-right:30px ;background-color:black;">x</button>
        `;
        
        requestContainer.appendChild(requestItem);
    }

    return `
        <div class="container-fluid text-end mb-3 pt-3" onclick="removeFriendRequestPopUp()">
            <button class="btn btn-danger btn-sm rounded-circle" style="border: none;">X</button>
        </div>
        <div class="container-fluid">
            ${requestContainer.innerHTML}
        </div>
    `;
}


async function showFriendsRequest() {
    if(document.querySelector('.friend-request-container')!= null){
        document.querySelector('.friend-request-container').remove();
    }
    let friendsrequests;
    await fetch('friendsrequest', {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie("csrftoken"),
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            friendsrequests = data;
        })

    const friendsRequestContainer = document.createElement('div');
    friendsRequestContainer.className = 'container-fluid friend-request-container';
    
    friendsRequestContainer.style = `
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 600px;
        overflow-y: auto;
        background-color: black;
        z-index: 1000;
        border-radius: 2em;
        border : 2px solid cadetblue;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity:0.8;
    `;
    
    friendsRequestContainer.innerHTML=`
        <div style="align-self:flex-end; "><button>X</button></div>
    `;
    let friendRequestListHTML = await makeHTMLForFriendRequest(friendsrequests);
    friendsRequestContainer.innerHTML = friendRequestListHTML;

    document.querySelector('body').append(friendsRequestContainer);
}

function removeSendFriendRequestPopUp(){
    document.querySelector('.add-friend-container').remove();

}

async function sendFriendRequest(){
    const myForm = document.querySelector('#friendRequestForm');
        const formdata = new FormData(myForm);

        await fetch('sendRequest',{
            method : 'POST',
            headers: {
                'X-CSRFToken' : getCookie("csrftoken"), 
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                'username' : formdata.get('username'),
            })
        })
            .then(response => response.json())
            .then(data=>{
                document.querySelector('#friend-request-message').innerHTML=data['content'];
            });
        

}
 
async function addFriend(){
    
    const AddFriendContainer = document.createElement('div');
    AddFriendContainer.className = 'container-fluid add-friend-container';

    AddFriendContainer.style = `
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 220px; 
        overflow-y: hidden;
        background-color: #121212;
        z-index: 1000;
        border-radius: 1.5em;
        border: 2px solid cadetblue;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 0.9;
        padding: 20px;
    `;


    AddFriendContainer.innerHTML = `
        <div class="container-fluid text-end">
            <button class="btn btn-danger btn-sm rounded-circle" style="border: none; background-color: cadetblue;" onclick="removeSendFriendRequestPopUp()">X</button>
        </div>
        <div class="container-fluid p-0">
            <form action="" class="container-fluid p-0" id="friendRequestForm">
                <input type="hidden" name="csrfmiddlewaretoken" value="${getCookie("csrftoken")}">
                <label for="username-entry" style="color: cadetblue; font-weight: bold;">Enter Username:</label>
                <input type="text" name="username-entry" class="form-control message-content" required 
                    style="margin-bottom: 15px; border-radius: 0.5em; padding: 10px; background-color: #333; color: white;">
                
                <button type="submit" class="btn btn-secondary container-fluid" onclick="sendFriendRequest()" 
                    style="border-radius: 0.5em; padding: 10px; background-color: cadetblue; color: white; font-weight: bold;">
                    Send
                </button>
                
                <div id="friend-request-message" style="color: white; margin-top: 15px;"></div>
            </form>
        </div>
    `;

    document.body.appendChild(AddFriendContainer);

    document.querySelector('body').append(AddFriendContainer);
    
}



/////////////////////////////LOGOUT////////////////////////////////
async function logout(){
    await fetch('logout',{
        method:'GET',
    })
        .then(response => {
            if(response.redirected){
                window.location.href = response.url;
            }
        });
}



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