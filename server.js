const express = require("express")
const app = express()
const fs = require("fs")
const multer = require("multer")

const storageEngine = multer.diskStorage({
    destination: (req, file, cb) =>{ 
        cb(null, "./root")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storageEngine})

app.listen(3002, ()=> {console.log('server up: port 3002')})


app.set("view engine", "ejs")

app.get("/", (req, res) => {
    if (!fs.existsSync("root"))
    fs.mkdirSync("root")
    res.render("index")
} )

app.post("/upload/:dir", upload.single("file") ,async function(req, res) {
    console.log(req.body)
    const { file } = req;
    res.send(file)
})

app.post("/creatfolder/:dir" ,async function(req, res) {
    const { file } = req;
    res.send(file)
})


app.get("/read", (req,res)=> {
    res.body = fs.readdirSync('./root/', (err, files) => {
        console.log(files)
                    });
    res.body = res.body.map(v => {if(v.includes(".")){return v} })
    res.send(res.body)
})

app.get("/allfolders", (req,res)=> {
    res.body = fs.readdirSync('./root/', (err, files) => {
        console.log(files)
                    });
    res.body = res.body.map(v => {if(!v.includes(".")){return v} })
    res.send(res.body)
})
