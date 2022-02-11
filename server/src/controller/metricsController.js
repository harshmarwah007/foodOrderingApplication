const foodOrders = require("../models/FoodOrders");


const getAllMetrics = async (req,res) =>{
    

    const topSelling = await foodOrders.aggregate([
        {$unwind:"$dishList"},
        {$group:{_id:"$dishList.name",qty:{$sum:"$dishList.qty"}}},
      {$sort:{qty:-1}}
    ]).limit(1)


    const count = await foodOrders.aggregate(
        [ 
            { "$group":  { _id: "$customerName", "count": { "$sum": 1 } } },
            {$sort:{count:-1}}
        ],  function(err, results) {
                // Do something with the results
            }
    )

    const orderMetrics ={
        topSelling:topSelling,
        count:count

        
    }
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