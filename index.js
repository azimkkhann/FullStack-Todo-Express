const Express = require("express")
const fs = require("fs").promises
const app = Express();
const cors = require("cors");


app.use(cors())
app.use(Express.json())

let file = fs.readFile("Todo.json", "utf-8");
 file = JSON.parse(file);

 let counter = file.length+1;


app.get("/", async (req, res) => {
    let data = await fs.readFile("Todo.json", "utf-8");
    res.json(JSON.parse(data));
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
   res.json(data);
})


app.delete("/:id", async (req, res)=>{
    let id = req.params.id;
    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);
    for(let i = 0; i<data.length; i++){
        if(data[i].id === id){
            data.splice(i, 1);
            break;
        }
    }
    
    await fs.writeFile("Todo.json", JSON.stringify(data));
    res.json(data);
})


app.put("/:id", async (req, res) => {


    let newvalue = req.body.newvalue;
    let data = await fs.readFile("Todo.json", "utf-8");
    data = JSON.parse(data);

    for(let i = 0; i<data.length; i++){
        if(data[i].id == req.params.id){
            data[i].todo = newvalue;
            break;
        }
    }

    await fs.writeFile("Todo.json", JSON.stringify(data));
    console.log("successfully updated");
})

app.listen(3000)