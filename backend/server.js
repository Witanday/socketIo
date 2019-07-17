const express= require('express')
const cors= require('cors');
const morgan= require('morgan');
const bodyParser = require('body-parser');
const socket = require('socket.io');

const db=[]

const app = express()
app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));
app.use(express.json());
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(require("body-parser").text());
app.use(bodyParser.urlencoded({extended: true}));




app.use(morgan('dev'))
app.use(require("body-parser").text());



app.get("/", (req,res)=>{
    return res.json(db)
})

app.post("/msg", (req,res)=>{
    const {username, message}= req.body;
    db.push({username,message})
    return res.json(db)
})

server = app.listen(8080, ()=>{
    console.log("/n SERVER IS UP /n")
})

io= socket(server);

 
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
        const {username, message}= data
        db.unshift({username,message})
        console.log(data)
        io.emit('RECEIVE_MESSAGE',  db);
    })
});