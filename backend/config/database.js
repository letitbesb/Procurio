const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:"./config.env"})


const connectDatabase = ()=>{
    mongoose
    .connect(process.env.URI,{useNewUrlParser: true,useUnifiedTopology: true,family: 4})
    .then((data)=>{
        console.log(`Successfully connected to database at ${data.connection.host}`);
    });
};

module.exports = connectDatabase


// const products=mongoose.Schema({
//     "name":String,
//     "price":Number,
//     "stock":Number
// })
// const collec=new mongoose.model("Products", products);
// const sb1=new collec({
//     "name":"Iphone",
//     "price":50,
//     "stock":5
// })
// const boi= async ()=>{
//     await sb1.save();
// }
// boi();