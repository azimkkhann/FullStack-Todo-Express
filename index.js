const Express = require("express")
const fs = require("fs").promises
const app = Express();
const cors = require("cors");


app.use(cors())
app.use(Express.json())

app.get("/", async (req, res) => {

    let data = await fs.readFile("Todo.json", "utf-8");
    res.json(JSON.parse(data));

})

app.post("/", async (req, res) =>{
    
    let body = req.body;
   let content = body.todotask;
   let obj ={
    "todo": `${content}`,
   }
   let data = await fs.readFile("Todo.json", "utf-8");
   
   data = JSON.parse(data);
   data.push(obj);
   await fs.writeFile("Todo.json", JSON.stringify(data));

   res.json(data)


   
})

app.listen(3000)