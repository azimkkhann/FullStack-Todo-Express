
        let submitbutton = document.getElementById("signin-submit-button");
        submitbutton.addEventListener("click", async (e) =>{

        
        let username = document.getElementById("signin-username-input").value;
        let password = document.getElementById("signin-password-input").value;


        if(username == "" || password == ""){
            alert("cannot leave empty values!")
            return;
        }

        let response = await fetch("http://127.0.0.1:3000/signin", {
                method : "POST",
                headers : {
                    "Content-type" : "application/json",
                    
                },
                body :JSON.stringify({
                    username : username,
                    password : password
                })
                
            })

            let data = await response.json();


            if(!response.status){
                alert("Cannot authenticate please sign up first and make an account then sing in")
                return;
            }

            let token = data.token;

            if(!token){
                alert("You are not logged in!");
                return;
            }

            localStorage.setItem("token", token);
            console.log(localStorage.getItem("token"));
            document.getElementById("signin-username-input").value = "";
            document.getElementById("signin-password-input").value = "";
            window.location.href = "/me";
        })
       

       
       let signupbutton = document.getElementById("signup-button");

       signupbutton.addEventListener("click", (e) =>{
        window.location.href = "/signup"
       })

