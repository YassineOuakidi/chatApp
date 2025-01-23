document.addEventListener('DOMContentLoaded' , async() => {
    document.querySelector(".check-password").addEventListener('change', (event) => {
        if (event.target.checked) {
            document.querySelector('#login-password').type = 'text';
        } else {
            document.querySelector('#login-password').type = 'password';
        }
    });
    const register = document.querySelector('#registration-panel');
    const login = document.querySelector("#login-panel");
    register.style.display="none";
    login.style.display ="block";
    //registration
    //registration
    //registration
    const registrationForm = document.querySelector('#registration');
    registrationForm.addEventListener('submit' , async(e) => {
        e.preventDefault();
        const formData = new FormData(registrationForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmation = formData.get('confirmation');
        const data = JSON.stringify({'username' : username,'email' : email,'password' : password,'confirmation' : confirmation,});
        await fetch('register' , {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: data,
        })
            .then(response => {
                if(response.redirected){
                    window.location.href = response.url;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if(data.error){
                    document.querySelector('.message-content-for-registration').innerHTML=data.error;
                }
            })
        
    })
    //login
    //login
    //login
    const loginForm = document.querySelector('#login');
    loginForm.addEventListener('submit' , async(e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        await fetch(`login` , {
            method : 'POST',
            headers:{
                'X-CSRFToken' : getCookie("csrftoken"), 
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                'username' : username,
                'password' : password,
            })
        })
            .then(response =>  {
                if(response.redirected){
                    window.location.href = response.url;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if(data.error){
                    console.log(data.error);
                    document.querySelector('.message-content-for-login').innerHTML=data.error;
                }
            })
        
    })
    
})


function logout(){
    fetch('logout',{
        method:'GET',
    })
        .then(response => {
            if(response.redirected){
                window.location.href = response.url;
            }
        });
}


function displayRegister(){
    const register = document.querySelector('#registration-panel');
    const login = document.querySelector("#login-panel");
    register.style.display="block";
    login.style.display ="none";
}
function displayLogin(){
    const register = document.querySelector('#registration-panel');
    const login = document.querySelector("#login-panel");
    register.style.display="none";
    login.style.display ="block";
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