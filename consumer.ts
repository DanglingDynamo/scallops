import dotenv from "dotenv";
import { loadConstants } from "./src/constants";
import { Message, SQS } from "@aws-sdk/client-sqs";
import Razorpay from "razorpay";
import prisma from "./prisma";
import { Order } from "@prisma/client";

dotenv.config();
loadConstants();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "dfkajkj",
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

async function consumeSQS(sqs: SQS, queueURL: string) {
    while (true) {
        try {
            const { Messages } = await sqs.receiveMessage({
                QueueUrl: queueURL,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 10,
            });

            if (!Messages) continue;

            for (let message of Messages) {
                // only 1 run
                await consumeMessage(message);
            }

            await sqs.deleteMessage({
                QueueUrl: queueURL,
                ReceiptHandle: Messages[0].ReceiptHandle,
            });
        } catch (error) {
            console.log("error", error);
        }
    }
}

const sqsClient = new SQS({
    region: process.env.REGION || "",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET || "",
    },
});

consumeSQS(sqsClient, process.env.QUEUE_URL || "");

async function consumeMessage(message: Message) {
    try {
        if (!message.Body) {
            throw Error("no message body");
        }
        const body = JSON.parse(message.Body);

        let success = false;
        switch (body.type) {
            case "LINK": {
                //const paymentLink = await razorpayInstance.paymentLink.fetch(body.id);
                //if (paymentLink.payments[0].status == "captured") {
                //    console.log("captured");
                //    success = true;
                //} else if (paymentLink.payments[0].status == "failed") {
                //    throw Error("payment failed");
                //}
                //
                //

                success = true;
                break;
            }
            case "ORDER": {
                const payments = await razorpayInstance.orders.fetchPayments(body.id);

                if (payments.count == 0) {
                    throw Error("payment not made yet");
                }

                payments.items.forEach((item) => {
                    if (item.status == "captured") {
                        success = true;
                    }
                });

                break;
            }
        }

        if (!success) {
            throw Error("payment not successful");
        }

        console.log("payment made");
        const order = await prisma.order.findFirst({
            where: {
                id: body.order,
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        order?.products.forEach((orderProduct) =>
            loopFunc(orderProduct)
                .then(() => { })
                .catch((error) => {
                    throw error;
                }),
        );
    } catch (error) {
        throw error;
    }
}

const loopFunc = async (orderProduct: any) => {
    const _product = await prisma.product.update({
        where: {
            id: orderProduct.product.id,
        },
        data: {
            quantity:
                orderProduct.product.quantity -
                Number(orderProduct.quantity.toString()),
        },
    });
};

/*
     {
    Body: '{"order":"31641298-ca98-4aef-a511-6136fa899553","receipt":"2ba2bb26-8698-42a9-bf45-7b152b5d6b22","type":"LINK","id":"plink_NyKk4tkexoI2zn"}',
    MD5OfBody: '40461e937a1f647213546c433357e075',
    MessageId: 'e9e2a228-e351-4315-8581-66fab47eebe3',
    ReceiptHandle: 'AQEB7mGNZUNMZsRsWRYSAuC7HguKGbg0zZcxQhZhHMP4z4l29Frzzds9LeAvM+zXX2tcsnapreky3Vu3AzIKSxhWsbkVC9NkKTuX9Rk2thPO6cLSDOZm8jKD1GXcGtrGOoKCDQUsl2a4D3ZmsTMDfDaYeARp/jwKJhNth7EMZwrNCe6xCSrimfjdI0vbJEoFmKejqHTlzHUr30MoM3wDG4LfbO0UblLt/4S5tpoTahNi9RcmCm3F1eQFrgEwb+uV2dbGBt+hHDlCBGOy7ysfpd2OoN0pJbCyUw6SnYLYX3keMMg2CAQUeH2e28/fEMwqSdFDjuQB3wBQ+vSyM83t+r4i2A2y8YIRR2gI9b2vjlavMdxxp4zP3BMVX5p7zyrpJ5f+oBpW1SH2eOD3QLvrN/UDHw=='
  }
]
*/
