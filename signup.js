


let submitbutton = document.getElementById("signup-button");



submitbutton.addEventListener("click", async (e) =>{

let response = null;
let username = document.getElementById("signup-username-input").value;
let password = document.getElementById("signup-password-input").value;

if(username == "" || password == ""){
    alert("cannot leave empty values!")
    return;
}

    response = await fetch("http://127.0.0.1:3000/signup", {
        method : "POST",
        headers: {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({
            "username" : username,
            "password" : password
        })
    })

     document.getElementById("signup-username-input").value = "";
     document.getElementById("signup-password-input").value = "";
     window.location.href = "/signin"
})


let signinbutton = document.getElementById("signin-button");

signinbutton.addEventListener("click", (e) => {
    window.location.href = "/signin";
})