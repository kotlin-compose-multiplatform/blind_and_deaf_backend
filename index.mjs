import cors from "cors";
import express from "express";
import fs from "fs";
import swaggerJsdoc  from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";
import router from "./routes/router.mjs";

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Operator Api",
            version:"1.0.0",
            description:"Operator Api from Shageldi Alyyew"
        },
        servers:[
            {
                url:"http://localhost:6415"
            }
        ]
    },
    apis:["./routes/*.js"]
}

const specs = swaggerJsdoc(options);

const app = express();
app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json({limit: '500mb', extended: true}));
app.use(express.urlencoded({limit: "500mb", extended: true, parameterLimit:500000}));
app.use('/api', router);
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));




const server=app.listen(5005, () => {
    console.log(`listening on port 5005`);
})

const io = new Server(server, { /* options */ });

io.on("connection", (client) => {
    console.log("Connected  "+client.id);
    client.on('onCall', (data)=> {
        console.log(data)
        io.emit('onCall', data);
    });
    client.on('onInbox', (data)=> {
        console.log(data)
        io.emit('onInbox', data);
    });
});

app.get('/socket-test', function(req, res) {
    const html=fs.readFileSync('public/index.html', 'utf8');
    res.send(html);
});



export const socket_io = io;
