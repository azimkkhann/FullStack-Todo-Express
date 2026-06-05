let addtodobutton = document.querySelector("button");
addtodobutton.addEventListener("click", addTodolist);


async function getrequest(){
    let token = localStorage.getItem("token");
    let data = await fetch("http://127.0.0.1:3000/me", {
        method : "GET", 
        headers : {
            authorization : token,
            "Content-type" : "application/json",
        }
    })
    let todos = await data.json();
    render(todos);
}




async function addTodolist(){

    let value = document.querySelector("input").value;
    if(value === ""){
        alert("Please enter the value!");
        return;
    }
    let response;
    try{
     response = await fetch("http://127.0.0.1:3000/me",{
        method: "POST",
        headers: {
    "Content-Type": "application/json",
    authorization : localStorage.getItem("token")
},
        body: JSON.stringify({
            todo : value
          
        }), 
    })

    

} catch(err){
    console.log(err);
    return;
}
document.querySelector("input").value = "";
let data = await response.json();
render(data);

}



 function maketodo(title,id, i){

    let element = document.createElement("div");
    element.setAttribute("id", `${id}`);
    let elementid = element.id;
    let todotitle = document.createElement("h4");
    todotitle.textContent = `${i+1}. ${title}`;
    todotitle.setAttribute("id", `title ${id}`)
    let deletebutton = document.createElement("button");
    deletebutton.innerText ="Delete";
    deletebutton.setAttribute("class",  "todo-div-button")
    deletebutton.setAttribute("id",  "todo-div-button-delete")

    deletebutton.addEventListener("click", async () =>{
       data =  await fetch(`http://127.0.0.1:3000/me/${elementid}`, {
            
            method: "DELETE",
            headers :{
                authorization : localStorage.getItem("token"),
                "Content-type" : "application/json"

            }
        })

        data = await data.json();
       
    } )

    

    let editbutton = document.createElement("button");
    editbutton.innerText = "Edit";
    editbutton.setAttribute("class", "todo-div-button")
    editbutton.setAttribute("id", "todo-div-button-edit")
    let isediting = false;
    let newelement;
    editbutton.addEventListener("click", () =>{
        if(!isediting){
            editbutton.style.backgroundColor = "green";
            editbutton.innerText = "Save";
            newelement = document.createElement("input");
            todotitle.replaceWith(newelement);
            isediting = true;
            return;
        }
        if(isediting){
            editbutton.style.backgroundColor = "yellow";
            editbutton.innerText = "edit"
            let newinput =  newelement.value;
            todotitle = document.createElement("h4");
            todotitle.innerText = `${i+1}. ${newelement.value}`;
            newelement.replaceWith(todotitle);
            
            isediting = false

            fetch(`http://127.0.0.1:3000/me/${elementid}`, {
                method : "PUT",
                headers:{
                    "content-type":"application/json",
                    authorization : localStorage.getItem('token')
                },
                body:JSON.stringify({
                    "newvalue" : `${newinput}`
                })
            })
            return;
        }
    })

    element.appendChild(todotitle);
    element.appendChild(editbutton);
    element.appendChild(deletebutton);

    element.setAttribute("class", "todo-divs")
    let parent =  document.getElementById("Todo-list-box");
    parent.appendChild(element);
    
}

function render(data){

    document.getElementById("Todo-list-box").innerHTML = "";
    let i = 1;
   for(let i = 0; i<data.length; i++){
    maketodo(data[i].todo, data[i].id,   i)
   }
    // for( const todo of data){
    //     maketodo(data.todo, todo, i);
    //     i++;
    // }
}



getrequest();