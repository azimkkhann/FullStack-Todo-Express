

let addtodobutton = document.querySelector("button");
addtodobutton.addEventListener("click", addTodolist);


async function getrequest(){
    let data = await fetch("http://127.0.0.1:3000/")
    let todos = await data.json();
    render(todos);
}

let counter = 0;

async function addTodolist(){
    counter += 1;
    let value = document.querySelector("input").value;
    if(value === ""){
        alert("Please enter the value!");
        return;
    }
    let todores;
    try{
     todores = await fetch("http://127.0.0.1:3000/",{
        method: "POST",
        headers: {
    "Content-Type": "application/json",
},
        body: JSON.stringify({
            "todotask" : `${value}`,
           "identi" :  `${counter}`,
        }), 
    })

} catch(err){
    console.log(err);
    return;
}
document.querySelector("input").value = "";
let data = await todores.json();
render(data);

}



 function maketodo(title,id, i){
    let element = document.createElement("div");
    element.setAttribute("id", `${id}`);
    let elementid = element.id;
    let todotitle = document.createElement("h3");
    todotitle.textContent = `${i+1}. ${title}`;
    let deletebutton = document.createElement("button");
    deletebutton.innerText ="Delete";
    deletebutton.setAttribute("class",  "todo-div-button")
    deletebutton.setAttribute("id",  "todo-div-button-delete")

    deletebutton.addEventListener("click", async () =>{
        let response = await fetch(`http://127.0.0.1:3000/${elementid}`, {
            method: "DELETE",
            body:JSON.stringify({
                "id" : `${id}`
            })
        })

        let data = await response.json();
       getrequest();
    } )

    let editbutton = document.createElement("button");
    editbutton.innerText = "Edit";
    editbutton.setAttribute("class", "todo-div-button")
    editbutton.setAttribute("id", "todo-div-button-edit")
    element.appendChild(todotitle);
    element.appendChild(editbutton);
    element.appendChild(deletebutton);

    element.setAttribute("class", "todo-divs")
    let parent =  document.getElementById("Todo-list-box");
    parent.appendChild(element);
    
}

function render(data){
    document.getElementById("Todo-list-box").innerHTML = "";
    
   for(let i = 0; i<data.length; i++){
    maketodo(data[i].todo, data[i].id,  i)
   }
}

function deletetodo(){

}

getrequest();