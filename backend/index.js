import express from 'express'
import { configDotenv } from 'dotenv';
const app = express();
configDotenv();


app.get("/", (req,res) =>{
    res.send("Server is Working fine ✅")
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})