const foodOrders = require("../models/FoodOrders");


const getAllMetrics = async (req,res) =>{
    const orderMetrics = await foodOrders.aggregate([
        {$unwind:"$dishList"},
        {$group:{_id:"$dishList.name",qty:{$sum:"$dishList.qty"}}},
      {$sort:{qty:-1}}
    ]).limit(1)

    
    console.log(orderMetrics);
    res.json({
        orderMetrics
    })
}

module.exports = getAllMetrics;

// foodOrders.aggregate([
//     {$unwind:"$dishList"},
//     {$group:{_id:"$dishList.name",qty:{$sum:"$dishList.qty"}}},
//   {$sort:{qty:1}}
// ]).limit(3).then((response)=>{console.log(response)
//     orderMetrics=response

// }
    
// ).catch((error)=>(
//     orderMetrics = error
// ))