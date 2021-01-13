
let loginform = document.getElementById("loginform") 
let signupform = document.getElementById("signupform") 

if(loginform !== null)
loginform.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    let email = document.getElementById("email").value 
    let password = document.getElementById("password").value

    let response = await fetch('/users/login', {
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({'email' : email, 'password' : password})
    })
    let loginmessage = document.getElementById("loginmessage")
    if(response.status === 400) 
        loginmessage.innerHTML = 'Invalid Login Credentials !' 
    else{
        const user = await response.json() 
        loginmessage.innerHTML = 'Login for '+ user.user.name+ ' Success'
        window.localStorage.setItem('token', user.token)
        window.location.replace('/profile') 
    } 
        

})

if(signupform !== null)
signupform.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    let name = document.getElementById("name").value
    let age = document.getElementById("age").value
    let email = document.getElementById("email").value 
    let password = document.getElementById("password").value
    const data = {name, email, password}

    if(age !== "")  data.age = parseInt(age)  


    let response = await fetch('/users', {
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data) 
    })
    let signupmessage = document.getElementById("signupmessage")
    const user = await response.json() 

    if(response.status === 400)
        if(user.message) 
            signupmessage.innerHTML = ':::'+user.message.substring(user.message.indexOf(":", user.message.indexOf(":") + 1))+':::' 
        else 
            signupmessage.innerHTML = ':::Duplicate email:::' 
    else        
        {
            signupmessage.innerHTML = 'Signup for '+ user.newuser.name+ ' Success' 
            window.localStorage.setItem('token', user.token)
            window.location.replace('/profile') 
        }       

})
