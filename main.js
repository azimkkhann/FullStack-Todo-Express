let counter = 0;

let addtodobutton = document.querySelector("button");
addtodobutton.addEventListener("click", addTodolist);

async function addTodolist(){
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
           
        }),
    })

} catch(err){
    console.log(err);
    return;
}

let data = await todores.json();
render(data);

}



function maketodo(title, i){
    let element = document.createElement("div");
    let todotitle = document.createElement("h3");
    todotitle.textContent = `${i}. ${title}`;
   
    element.appendChild(todotitle);
    let parent =  document.getElementById("Todo-list-box");
    parent.appendChild(element);
}

function render(data){
    document.getElementById("Todo-list-box").innerHTML = "";
    let count = 1;
   for(let i = 0; i<data.length; i++){
    maketodo(data[i].todo, i)
   }
}