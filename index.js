const Express = require("express")
const fs = require("fs").promises
const app = Express();
const cors = require("cors");
const path = require("path")


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

    try{
    let data = await fs.readFile("Todo.json", "utf-8");
    res.json(JSON.parse(data));
    } catch(err){
        return new "cannot get Todo!"
    }
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

app.listen(3000)