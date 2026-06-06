const Express = require("express")
const fs = require("fs").promises
const app = Express();
const cors = require("cors");
const path = require("path");
const { readFile } = require("fs");
const { use } = require("react");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "jwtsecret"


app.use(cors());
app.use(Express.json());
app.use(Express.static(__dirname))

let counter;

async function init(){
let file = await fs.readFile(path.join(__dirname, "Todo.json"), "utf-8");
file = JSON.parse(file);
counter = file.length;
}

init();


async function jwtdecode(req, res, next) {
    let token = req.headers.authorization;
    token = jwt.verify(token, JWT_SECRET);
    
    if(!token){
        return res.status(401).send("You are unauthorized")
    }

    req.headers.username = token.username;
    next();

}


app.get("/me", jwtdecode, async (req, res) =>{
    
    let username = req.headers.username;

    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);

    let user = data.find((u) =>{
        if(u.username == username){
            return u;
        }
    })

    let todos = user.todo;
    res.json(todos);


})

 app.post("/me", jwtdecode, async (req, res) => {


    let username = req.headers.username;
    let todo = {
        id : counter,
        todo : req.body.todo
    };
    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);

    let user = data.find((u) =>{
        if(u.username == username){
            return u;
        }
    })

    
    
    let todos = user.todo.push(todo);

    res.json(user.todo);
    await fs.writeFile("Todo.json", JSON.stringify(data));
    counter++;
 })



app.get("/", async (req, res) => {
    return res.sendFile(path.join(__dirname, "signup.html"))
})





app.delete("/me/:id",jwtdecode, async (req, res)=>{

    let username = req.headers.username;
    let id = req.params.id;
    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);


    let user = data.find((u) => {
        if(u.username == username ){
            return u;
        }
    })

   
   
    for(let i = 0; i<user.todo.length; i++){
        if(user.todo[i].id == id){
            user.todo.splice(i, 1);
            break;
        }
    }
    
    await fs.writeFile("Todo.json", JSON.stringify(data));
    let todos = user.todo;
    res.json(todos);
})


app.put("/me/:id", jwtdecode, async (req, res) => {


    let username = req.headers.username;
    let id = req.params.id;


    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);


    let user = data.find((u) =>{
        if(u.username == username){
            return u;
        }
    })

    let task = user.todo.find((u) => {
        if(u.id == id){
            return u;
        }
    })

    
    let newvalue = req.body.newvalue;
    
   task.todo = newvalue;

    await fs.writeFile("Todo.json", JSON.stringify(data));
    res.send("edited sucessfully")
})

app.post("/signup", async (req, res) =>{

    let username;
    let password;

    try{
        username = req.body.username;
        password = req.body.password;
    } catch (err){
        return res.status(403).send(err);
    }


    let data = await fs.readFile("Todo.json","utf-8");
    data = JSON.parse(data);

    let Exists = false;

   data.find((u) => {
    if(u.username == username){
        Exists = true;
        return;
    }
   });

   if(Exists){
    return res.status(409).send("Username already Exists!");
   }

   let newuser =  {
    username : username,
    password : password,
    todo : []
   };

   data.push(newuser);
   fs.writeFile("Todo.json", JSON.stringify(data));
   res.sendFile(path.join(__dirname, "signin.html"))
    console.log(data);

})


app.get("/signin", (req, res) =>{
    res.sendFile(path.join(__dirname, "signin.html"));
})

app.post("/signin", async (req,res) =>{

    let username = null;
    let password = null;

    try{
        username = req.body.username;
        password = req.body.password;
    } catch(err){
        return res.status(500).send(err);
    }

    let data = null;

    try{
        data = await fs.readFile("Todo.json", "utf-8");
        data = JSON.parse(data);
    } catch (err){
        return res.status(500).send(err)
    }

    let isthere = data.find((u) =>{
        if(u.username == username && u.password == password){
            return true;
        }
    })

    if(!isthere){
        return res.status(401).send("Username or Password is invalid or do not exists!");
    }

    let token = jwt.sign({
        username : username
    }, JWT_SECRET);

    res.json({
        "token" : token
    })


})

/*
{
username : username
password : password
todo : []
}
*/

app.listen(3000)