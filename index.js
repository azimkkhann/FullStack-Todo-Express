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

let counter;

async function init(){
let file = await fs.readFile(path.join(__dirname, "Todo.json"), "utf-8");
file = JSON.parse(file);
counter = file.length+1;
}

init();



app.get("/", async (req, res) => {
    return res.sendFile(path.join(__dirname, "signup.html"))
})

app.post("/", async (req, res) =>{

    let body = req.body;
   let content = body.todotask;
   
   let obj ={
    "todo": `${content}`,
    "id": `${counter}`
   }
   let data = await fs.readFile("Todo.json", "utf-8");
   
   data = JSON.parse(data);
   data.push(obj);
   await fs.writeFile("Todo.json", JSON.stringify(data));
   counter = counter +1;
   res.status(201).json(data);
})


app.delete("/:id", async (req, res)=>{
    let id = req.params.id;
    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);
    let isthere = false;
    for(let i = 0; i<data.length; i++){
        if(data[i].id === id){
            data.splice(i, 1);
            isthere = true;
            break;
        }
    }

    if(!isthere){
        res.status(404).json({
            "error" : "Todo not found!"
        });
    }
    
    await fs.writeFile("Todo.json", JSON.stringify(data));
    res.json(data);
})


app.put("/:id", async (req, res) => {


    let newvalue = req.body.newvalue;
    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);
    let isthere = false;
    for(let i = 0; i<data.length; i++){
        if(data[i].id == req.params.id){
            data[i].todo = newvalue;
            isthere = true;
            break;
        }
    }

    if(!isthere){
        return res.status(404).json({
            error : "Not found"
        })
    }

    await fs.writeFile("Todo.json", JSON.stringify(data));
    console.log("successfully updated");
})

app.post("/signup", async (req, res) =>{

    let username;
    let password;

    try{
        username = req.body.username;
        password = req.body.password;
    } catch (err){
        return res.status(403).send("Cannot create user");
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
        return res.status(404).send("Username or Password is invalid or do not exists!");
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