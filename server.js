const { text } = require("express")
const express = require("express")
const app = express()
const fs = require("fs")
const multer = require("multer")

const storageEngine1 = multer.diskStorage({
    destination: (req, file, cb) =>{ 
        cb(null, "./root")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const storageEngine2 = multer.diskStorage({
    destination: (req, file, callback) => {
        let dir = req.query.dir;
        let path = `./root/${dir}`;
        callback(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload1 = multer({ storage: storageEngine1})
const upload2 = multer({ storage: storageEngine2})

app.listen(3002, ()=> {console.log('server up: port 3002')})

app.get("/", (req, res) => {
    if (!fs.existsSync("root"))
    fs.mkdirSync("root")
} )

app.post("/upload", upload1.single("file") ,async function(req, res) {
    const { file } = req;
    res.send('file uploaded')
})

app.post("/upload/*", upload2.single("file") ,async function(req, res) {
    const { file } = req;
    res.send('file uloaded')
})

app.post("/creatfolder", upload1.single('text') ,function(req, res) {
    if (!fs.existsSync(`./root/${req.query.folder}`|| req.query.folder !== 'root')){
    fs.mkdirSync(`./root/${req.query.folder}`)}
    else{
        throw res.send('folder by this name already exist here')
    }
    res.send('folder created')
})

app.post("/creatfolder/*", upload1.single('text') ,async function(req, res) {
    console.log(req.body)
    if (!fs.existsSync(`./root/${req.body.dir}/${req.body.folder}`)){
    fs.mkdirSync(`./root/${req.body.dir}/${req.body.folder}`);
    res.send('folder created')}
    else{
        throw res.send('folder by this name already exist here')
    }
})

app.get("/read", (req,res)=> {
    res.body = fs.readdirSync(`./root/`, (err, files) => {
        console.log(files)
                    });
    res.body = res.body.map(v => {if(v.includes(".")){return v} })
    res.send(res.body)
})

app.get("/read/*", (req,res)=> {
    res.body = fs.readdirSync(`./root/${req.query.dir}`, (err, files) => {
        console.log(files)
                    });
    res.body = res.body.map(v => {if(v.includes(".")){return v} })
    res.send(res.body)
})

app.get("/allfolders", (req,res)=> {
    console.log('fly');
    result = fs.readdirSync('./root/', (err, files) => {
        console.log(files)
                    });
    result = result.map(v => {if(!v.includes(".")){return v} })
    res.send(result)
})

app.get("/allfolders/*" ,(req,res)=> {
    console.log('overhere')
    console.log(req.query.dir)
    
    res.body = fs.readdirSync(`./root/${req.query.dir}`, (err, folders) => {
        console.log(folders)
                    });
    res.body = res.body.map(v => {if(!v.includes(".")){return v} })
    res.send(res.body)
})
