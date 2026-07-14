

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/// فقط روی سیستم لوکال پوشه uploads ساخته شود
if (process.env.VERCEL !== "1") {
    if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
    }
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

    if (process.env.VERCEL === "1") {
        return cb(new Error("آپلود فایل روی نسخه نمایشی غیرفعال است."));
    }

    cb(null, "uploads");

},

    filename: (req, file, cb) => {

        const ext = path.extname(file.originalname);

        const fileName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000) +
            ext;

        cb(null, fileName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
       "image/svg+xml"
    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("فرمت فایل مجاز نیست"));

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

module.exports = upload;
