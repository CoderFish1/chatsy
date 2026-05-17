import express from 'express';
import { configDotenv } from 'dotenv';
import { chats } from './data/data.js';

const app = express();
configDotenv();

app.get('/',(req,res) =>{
    res.send('API is Running')
} )

app.get('/api/chat', (req,res)=>{
    res.send(chats)
})

app.get('/api/chat/:id', (req, res)=>{
    // console.log(req.params.id)
    const singleChat = chats.find((c)=>
       c._id === req.params.id
    );
    res.send(singleChat);
})

const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`Server started on PORT ${PORT}`))   
