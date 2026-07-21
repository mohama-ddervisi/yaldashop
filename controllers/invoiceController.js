const PDFDocument = require("pdfkit");
const path = require("path");
const prisma = require("../lib/prisma");

async function printInvoice(req, res) {
    try {

        const id = Number(req.params.id);

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).send("سفارش پیدا نشد");
        }

      const doc = new PDFDocument({
    margin: 40,
    size: "A4",
    bufferPages: true
});

const fontPath = path.join(
    __dirname,
    "../assets/fonts/Vazirmatn-Regular.ttf"
);

doc.registerFont("Vazir", fontPath);

doc.font("Vazir");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename=invoice-${order.id}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(22).text("Yalda Shop", {
            align: "center"
        });
doc.moveDown();

doc.fontSize(18).text(
    "فاکتور فروش یلدا شاپ",
    {
        align: "right"
    }
);

doc.moveDown();

doc.fontSize(14).text(
    `مشتری: ${order.fullName}`,
    {
        align: "right"
    }
);

doc.text(
    `شماره سفارش: ${order.id}`,
    {
        align: "right"
    }
);
        doc.moveDown();

        doc.fontSize(16).text(`Invoice #${order.id}`);
        doc.text(`Customer: ${order.fullName}`);
        doc.text(`Phone: ${order.phone}`);
        doc.text(`Address: ${order.address}`);

        doc.moveDown();

        doc.fontSize(18).text("Products");

        doc.moveDown(0.5);

        order.items.forEach(item => {

            doc.fontSize(12).text(
                `${item.product.name}
Qty: ${item.quantity}
Price: ${item.price.toLocaleString()}
`
            );

        });

        doc.moveDown();

        doc.fontSize(18).text(
            `Total : ${order.total.toLocaleString()} Toman`
        );

        doc.end();

    } catch (err) {

        console.error(err);

        res.status(500).send("خطا در ساخت فاکتور");

    }
}

module.exports = {
    printInvoice
};