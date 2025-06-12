import {WebSocketServer} from "ws"

const wss = new WebSocketServer({port:9002})

wss.on('connection',(ws)=>{

    ws.on('message',(data)=>{
        ws.send("hii")
    })
})