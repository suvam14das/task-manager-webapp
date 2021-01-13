//console.log(" This is app.js ", window.localStorage.getItem('token'))
"use strict"
let tasks ; 

if(document.title === 'Profile | Task Manager')
window.addEventListener('load', async () => {
    let response = await fetch('/users/me', {
        method: 'GET', 
        headers: {
            'Accept': 'application/json', 
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        }
    })
    
    if(response.status === 401) 
        window.location.replace('/')
    
    let user = await response.json()    
    console.log(user)
    document.getElementById("name").innerHTML += user['name'] 
    document.getElementById("age").innerHTML += user['age'] + 'years'
    document.getElementById("email").innerHTML += user['email']  
 
})

if(document.title === 'Tasks | Task Manager')
window.addEventListener('load', async () => {
    
    let response = await fetch('/tasks', {
        method: 'GET', 
        headers: {
            'Accept': 'application/json', 
            'Authorization': 'Bearer '+ window.localStorage.getItem('token')
        }
    })
    if(response.status === 401) 
    window.location.replace('/')

    tasks = await response.json() 
    console.log(tasks) 
    document.getElementById("tasklist").innerHTML = '</br>'
    for(var task in tasks){
        let card = '<div id='+(tasks[task]['_id'])+'>'
        card += tasks[task]['description']+'    -   '+ (tasks[task]['completed']?'Complete':'Incomplete')+'</br>'
        card += '<a href="#" id='+(tasks[task]['_id'])+' onclick=deltask(this.id) > Delete </a>' 
        card += '<a href="#" id='+(task)+' onclick=updatetask(this.id) > Update </a>'
        card += '</div >'
        card += '<p id="updateform"></p>'
 
        document.getElementById("tasklist").innerHTML += card  
    }

})

async function deltask(taskid){

    console.log(taskid)
    if(confirm("Sure you wanna dump this task ?") === false) return 
    let response = await fetch('/tasks/'+taskid, {
        method: 'DELETE', 
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        }
    })
    if(response.status === 401) 
    window.location.replace('/')

    alert("Task Deleted !");
    location.reload()
    
    
}

async function updatetask(index){ 

    var task = tasks[index]

    var oldtask = document.getElementById(task['_id'])
    oldtask.style.visibility = "hidden" 

    let card = '<form id="updtask">'+

    '<p>Enter Task Description *</p>'+
    '<textarea id="description" rows="4" cols="50" required></textarea>'+
    '</br>'+

    '<p>Select Completed Status (Optional)</p>'+
    '<input type="radio" name="completed" value="yes">Yes'+           
    '<input type="radio" name="completed" value="no">No'+
    '<p script="padding-top:20px"></p>'+
    '<button id="update">Update</button>'+

    '</form>'

    
    document.getElementById("updateform").innerHTML = card
    document.getElementById("description").innerText = task['description']

    document.getElementById("update").onclick = async (e)=>{
        e.preventDefault()
        
        let data = {}
        data.description = document.getElementById("description").value 
        let completed = document.getElementsByName("completed") 

        for(var i=0; i<completed.length;i++){
            if(completed[i].checked)
                if(completed[i].value === 'yes')
                    data.completed = true
                else 
                    data.completed = false 
        }
        console.log(data)
    
        let response = await fetch('/tasks/'+task['_id'], {
            method: 'PATCH', 
            headers:{
                'Content-Type' : 'application/json', 
                'Accept' : 'application/json', 
                'Authorization' : 'Bearer '+window.localStorage.getItem('token')
            }, 
            body: JSON.stringify(data) 
        })

        if(response.status === 401) 
        window.location.replace('/')

        let updatedtask = await response.json() 
        console.log(updatedtask)

        alert('Task updated !');
        location.reload()

        }

}

if(document.title === 'Create Task | Task Manager')
document.getElementById("submit").onclick = async (e) => { 

    e.preventDefault() 
    let data = {}
    data.description = document.getElementById("description").value 
    let completed = document.getElementsByName("completed") 

    for(var i=0; i<completed.length;i++){
        if(completed[i].checked)
            if(completed[i].value === 'yes')
                data.completed = true
            else 
                data.completed = false 
    }
    console.log(data)
    let response = await fetch('/tasks', {
        method: 'POST', 
        headers:{
            'Content-Type' : 'application/json', 
            'Accept': 'application/json', 
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        }, 
        body: JSON.stringify(data) 
    })

    if(response.status === 401) 
    window.location.replace('/')

    let task = await response.json() 
    console.log(task)
    alert('New task created !'); 
    location.reload() 
}

if(document.title === 'Logout | Task Manager')
{    
    document.getElementById("logout").onclick = async () => {
        
        await fetch('/users/logout', {
            method : 'POST', 
            headers: {   
                'Authorization': 'Bearer '+ window.localStorage.getItem('token')
            }
        })

        window.location.replace('/')
    }

    document.getElementById("logoutall").onclick = async () => {
        
        await fetch('/users/logoutall', {
            method : 'POST', 
            headers: {  
                'Authorization': 'Bearer '+ window.localStorage.getItem('token')
            }
        })

        window.location.replace('/')
    }

    document.getElementById("delaccount").onclick = async () => {
        
        if(confirm("Do you wanna a break ?") === false)
        return
        
        await fetch('/users/me', {
            method : 'DELETE', 
            headers: {  
                'Authorization': 'Bearer '+ window.localStorage.getItem('token')
            }
        })

        window.location.replace('/')
    }
    
}
