const express=require('express');
const expressLayout=require('express-ejs-layouts');
const mongoose=require('mongoose');
const app=express();
//db config

const db=require('./config/keys').MongoURI;
//connect mongo
mongoose.connect(db,{useNewUrlParser:true} )
.then(()=>console.log("mongodb connected"))
.catch(err=>console.log(err));
//ejs
app.use(expressLayout);
app.set('view engine','ejs');
//body parser
app.use(express.urlencoded({extended:false}));

//rotes
app.use('/user',require('./routes/user'));
app.use('/',require('./routes/index'));


const PORT=process.env.PORT ||5000;
app.listen(PORT,console.log(`Server started on port ${PORT}`));