 let form = document.querySelector("form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(form);

            let username = data.usernameinput;
            let password = data.password;

            let response = await fetch("127.0.0.1:3000/signup", {
                method : "POST",
                headers : {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({
                    "username" : username, 
                    "password" : password
                })
            })

        })