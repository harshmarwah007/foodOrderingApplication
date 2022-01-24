const foodOrders = require("../models/FoodOrders");

// For Root User

const getAllOrders = async(req,res)=>{
    try {
        const orders = await foodOrders.find();
        res.json({orders,user: {
            id: req.user._id,
            email: req.user.email,
        }})
    } catch (error) {
        res.json({message:error})
    }
}

//For single User

const getOrders = async(req,res)=>{
    try {
        const orders = await foodOrders.find({userId:req.user._id})
    res.json({orders,user: {
        id: req.user._id,
        email: req.user.email,
    }})
    } catch (error) {
        res.json({message:error})
    }
}
// for saving one order
const saveOrder = async( req,res) =>{
    const array = req.body.dishList.map((item)=>{
        console.log(item)
    })
    const order = new foodOrders({
        userId: req.user._id,
        orderStatus:req.body.orderStatus,
        orderAmount:req.body.orderAmount,
        dishList: req.body.dishList
        // [{value1:1},{value2:2},{value3:3}]
    })

    try {
    const savedOrder = await order.save();
    res.json({savedOrder,user: {
        id: req.user._id,
        email: req.user.email,
    }})
    } catch (error) {
        res.json({message:error})
    }
}


module.exports =  {getOrders,saveOrder,getAllOrders}