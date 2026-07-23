const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");

const bcrypt = require("bcrypt");

function generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function register(req, res){

    try{

        const {

            fullName,
            phone,
            email,
            password

        } = req.body;

        if(!fullName || !phone || !password){

            return res.status(400).json({

                success:false,
                message:"همه فیلدهای ضروری را وارد کنید."

            });

        }

        const exists = await prisma.user.findFirst({

            where:{

                OR:[

                    { phone },

                    email ? { email } : undefined

                ].filter(Boolean)

            }

        });

        if(exists){

            return res.status(400).json({

                success:false,

                message:"این کاربر قبلاً ثبت شده است."

            });

        }

        const hashedPassword =
        await bcrypt.hash(password,10);

        const user =
        await prisma.user.create({

            data:{

                fullName,

                phone,

                email: email || null,

                password: hashedPassword

            }

        });

        res.status(201).json({

            success:true,

            message:"ثبت‌نام با موفقیت انجام شد.",

            user:{
                id:user.id,
                fullName:user.fullName,
                phone:user.phone
            }

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"خطای سرور"

        });

    }

}
async function login(req, res) {

    try {

      const {

    password

} = req.body;

const username = req.body.phone;

      

const user = await prisma.user.findFirst({

    where:{

        OR:[

            {

                phone: username

            },

            {

                email: username

            }

        ]

    }

});

        if (!user) {

            return res.status(400).json({

                success: false,

                message: "کاربر یافت نشد."

            });

        }

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.status(400).json({

                success: false,

                message: "رمز عبور اشتباه است."

            });

        }

        const token = jwt.sign(

            {

                id: user.id,

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.json({

            success: true,

            token,

            user: {

                id: user.id,

                fullName: user.fullName,

                phone: user.phone,

                role: user.role

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "خطای سرور"

        });

    }

}

async function sendCode(req, res) {

     console.log("=== sendCode called ===");
  
    try {
console.log("STEP 1");

        const { phone } = req.body;

        console.log("STEP 2", phone);

        if (!/^09\d{9}$/.test(phone)) {

            return res.status(400).json({
                success: false,
                message: "شماره موبایل معتبر نیست."
            });

        }

        const code = generateCode();

        console.log("STEP 3", code);

        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        console.log("STEP 4");

        await prisma.verificationCode.create ({ 

            

            data: {

                phone,

                code,

                expiresAt

            }

        });
console.log("STEP 5");
        console.log("========== OTP ==========");
        console.log("PHONE:", phone);
        console.log("CODE :", code);
        console.log("=========================");

        res.json({

            success: true,

            message: "کد تایید ارسال شد."

        });

    }

    catch (error) {

      console.error("SEND CODE ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "خطای سرور"
        });

    }

}
async function verifyCode(req, res) {

    try {

        const { phone, code } = req.body;

        if (!phone || !code) {

            return res.status(400).json({
                success: false,
                message: "اطلاعات ناقص است."
            });

        }
const verification =
    await prisma.verificationCode.findFirst({

        where: {

            phone,
            code,
            used: false

        },

        orderBy: {

            createdAt: "desc"

        }

    });
    if (!verification) {

    return res.status(400).json({

        success: false,
        message: "کد تایید صحیح نیست."

    });

}
if (verification.expiresAt < new Date()) {

    return res.status(400).json({

        success: false,
        message: "کد منقضی شده است."

    });

}
console.log(verification);



    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "خطای سرور"
        });

    }

}
module.exports = {

    register,

    login,

    sendCode,

    verifyCode

};
