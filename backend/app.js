const express=require("express");
const app=express();
const error_middleware= require("./middleware/error");
const cookieParser= require("cookie-parser");


app.use(express.json())
app.use(cookieParser())

//importing all routes
const product= require("./routes/productRoute");
const user= require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use(error_middleware);



module.exports=app;