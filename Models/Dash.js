const mongoose=require('mongoose');
const DashBoardSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    ProductName:{
        type:String,
        required:true

    },
    Quantity:{
        type:Number,
        required:true

    },
    PriceQuantity:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    Month:{
        type:String,
        default:new Date().getMonth()+1
    }
})

const Dash=mongoose.model('Dash',DashBoardSchema);
module.exports=Dash;