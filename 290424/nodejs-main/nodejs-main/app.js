const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT;

/*-----------------------------------------------------*/
app.use(bodyParser.json());
//CORS
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Origin','GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Origin', 'Content-Type, Authorization');
    next();
});
app.use(cors({
    origin:true,
    credentials:true,
    methods:'POST,GET,PUT,OPTIONS,DELETE'
}))
/*-----------------------------------------------------*/
const api = require('./router/api');
app.use('',api);




app.listen(PORT, console.log(`server running on port ${PORT}`));