const express=require("express");
const router=express();
var nodemailer = require('nodemailer');
var ssn ;
//User model
const User=require('../Models/User');
const Dab=require('../Models/Dash');
const bcrypt=require('bcryptjs')
//register page
router.get('/login',(req,res)=>res.render("login"));
//login
router.get('/register',(req,res)=>res.render("register"));
var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
//handling request
router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body;
    let errors=[]

    //check required fileds

    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill all the field'})

    }
    if(password!= password2){
        errors.push({msg:"password mismatch"});
    }
    //check password is sixe character length
    if(password.length<6){
        errors.push({msg:'password has to be atleast 6 characters'})
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //validation passed
        User.findOne({email:email}).then(user=>{
            if(user){
                res.render('register')

            }
            else{
                const newUser=new User({
                    name,
                    email,
                    password

                    

                })
                console.log(newUser);
                newUser.save().then(()=>res.render('login')).catch(err=>console.log(err));
                
            }
        })

    }
});
router.post('/dashboare',(req,res)=>{
    //const{email,productname,quantity,price}=req.body;
    console.log(req.body);
    var{email,ProductName,Quantity,QuantityType,PriceQuantity}=req.body;
    ProductName=ProductName.toString();
    ProductName=ProductName.toUpperCase();
    console.log(email,ProductName,Quantity,PriceQuantity);
    const Dashb=new Dab({
        email,
        ProductName,
        Quantity,
        QuantityType,
        PriceQuantity
    });
    user={
        email:null
    }
    user.email=email;
    console.log(Dashb);
    Dab.find({ProductName:ProductName,Month:new Date().getMonth()+1}).then(
        prod=>{
            if(prod){
                console.log("update");
                
                
                Dab.update({ProductName:ProductName,Month:new Date().getMonth()+1},{$inc:{PriceQuantity:PriceQuantity,Quantity:Quantity,date:Date.now()}})
                console.log(Dab.find({ProductName:ProductName}));

            }
            else{
                Dashb.save().then(ser=>console.log("Data Inserted")).catch(err=>console.log(err))
            }
        }
    ).catch(err=>console.log(err));
   
    res.render('dashboard',{user:ssn});

});
router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.render('login');

    }
    else{
        
        User.findOne({email:email,password:password}).then(user=>{
            if(user){
                
                ssn=user;
                res.render('dashboard',{user:ssn});
            }
           
        }).catch(err=>console.log(err));
    }
});

router.get('/Status',(req,res)=>{
    let df=[]
    res.render('Status',{ssn:ssn,arg:df});
});


router.post('/Status',(req,res)=>{
    const searchinp=req.body.search;
    console.log(searchinp);
    //Dab.find({Month:searchinp}).forEach((doc)=>{
      //  console.log(doc.ProductName)
    
    //})
    let arg=[]
    Dab.find({Month:searchinp,email:ssn.email}).then(arr=>{
        
        arg=arr;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'prashantpadhy21@gmail.com',
              pass: '21052003'
            }
          });
          var st=" "
          var ct=0
          arg.forEach((data)=>{
              ct+=data.PriceQuantity
              st+=`Date is ${data.date}\n Month is ${months[data.Month-1]}\n ProductName is ${data.ProductName} \n Quantity Of Items Purchased is ${data.Quantity} \n Price_Per_Quantity is ${data.PriceQuantity}\n\n\n`
          })
          st+=`Total Expenditure in this month: ${months[searchinp-1]} is ${ct}`
          var mailOptions = {
            from: 'prashantpadhy21@gmail.com',
            to: JSON.stringify(ssn.email),
            subject: 'The Following Result Shows the Grocery Items shown to you In the website in your last visit',
            text:st
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });



        console.log(arg);
        res.render("Status",{ssn:ssn,arg:arg});
    }).catch(err=>{
        console.log(err);
    })
    
});
router.get('/dashboard',(req,res)=>{
    res.render('dashboard',{user:ssn});
});

router.get('/logout',(req,res)=>{
    res.render("welcome");
})

module.exports=router;
