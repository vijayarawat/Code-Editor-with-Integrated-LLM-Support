require('dotenv').config({ path: '/home/vijaya/Documents/frontEnd/leetcode/.env' })

const express = require('express')
const app = express();
const main = require("./config/db");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./models/redis');
const problemRouter = require('./routes/problemCreator')
const submitRouter= require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/vedioCreator")
const cors = require('cors')
// console.log("PORT from env:", process.env.PORT);

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.use(express.json())
app.use(cookieParser())
app.use('/user',authRouter)
app.use('/problem',problemRouter)
app.use('/submission',submitRouter)
app.use('/ai',aiRouter)
app.use('/video',videoRouter)


const initalizeConnection=async () => {
    try{

        await Promise.all([main(), redisClient.connect()])
        console.log("DB connected")
        app.listen(process.env.PORT, ()=>{
        console.log("Server is listening at port,"+ process.env.PORT)
        })
    }
    catch(err){
        console.log(err)
    }
}

initalizeConnection();

// main()
// .then(async ()=>{

// app.listen(process.env.PORT, ()=>{
//     console.log("Server is listening at port,"+ process.env.PORT)
// })

// })
