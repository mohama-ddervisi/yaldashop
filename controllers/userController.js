const prisma = require("../lib/prisma");

async function getUsers(req, res){

    try{

        const users = await prisma.user.findMany({

          include: {
    _count: {
        select: {
            orders: true
        }
    },
    orders: {
        select: {
            total: true
        }
    }
},
            orderBy:{

                createdAt:"desc"

            }

        });

        const result = users.map(user=>{

            const totalSpent = user.orders.reduce(

                (sum,order)=>sum+order.total,

                0

            );

            return{

                id:user.id,

                fullName:user.fullName,

                phone:user.phone,

                email:user.email,

                createdAt:user.createdAt,

                orders:user._count.orders,

                totalSpent

            };

        });

        res.json(result);

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            message:"خطا"

        });

    }

}

async function getUser(req,res){

    try{

        const id = Number(req.params.id);

        const user = await prisma.user.findUnique({

            where:{ id },

            include:{

                orders:{

                    orderBy:{

                        createdAt:"desc"

                    }

                }

            }

        });

        if(!user){

            return res.status(404).json({

                message:"کاربر پیدا نشد"

            });

        }

        res.json(user);

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            message:"خطا"

        });

    }

}

module.exports={

    getUsers,

    getUser

};