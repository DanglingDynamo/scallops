import prisma from "../../prisma";
import { razorpayInstance } from "../lib/razorpay";
import { v4 as uuid } from "uuid";
import { sendMessage, sqsClient } from "../lib/sqs";

export async function createONDCPayment(
    amount: Number,
    orderID: String,
    buyerName: String,
) {
    try {
        const paymentLink = await razorpayInstance.paymentLink.create({
            amount: amount.valueOf() * 100,
            currency: "INR",
            description: "selling package over ONDC",
            customer: {
                name: buyerName.toString(),
            },
        });

        const payment = await prisma.payment.create({
            data: {
                orderID: orderID.toString(),
                amount: amount.valueOf(),
                receipt: uuid(),
                is_paid: false,
                is_dispersed: false,
                type: "ONLINE",
            },
        });

        const sqsData = sendMessage(sqsClient, {
            MessageBody: JSON.stringify({
                order: orderID,
                receipt: payment.receipt,
                type: "LINK",
                id: paymentLink.id,
            }),
            QueueUrl: process.env.QUEUE_URL || "",
        });

        console.log(sqsData);
        return paymentLink.short_url;
    } catch (error) {
        throw error;
    }
}

export async function createLocalPayment(
    amount: Number,
    orderId: String,
    paymentType: "CASH" | "ONLINE",
) {
    try {
        const receiptId = uuid();

        let orderID: string | null = null;
        if (paymentType == "ONLINE") {
            const order = await razorpayInstance.orders.create({
                amount: amount.valueOf() * 100,
                currency: "INR",
                receipt: receiptId,
            });

            if (!order) {
                throw Error("some error occurred");
            }

            orderID = order.id;

            const sqsData = sendMessage(sqsClient, {
                MessageBody: JSON.stringify({
                    order: orderId,
                    receipt: receiptId,
                    type: "ORDER",
                    id: order.id,
                }),
                QueueUrl: process.env.QUEUE_URL || "",
            });

            console.log(sqsData);
        }

        await prisma.payment.create({
            data: {
                orderID: orderId.toString(),
                amount: amount.valueOf(),
                receipt: receiptId,
                is_paid: false,
                is_dispersed: false,
                type: paymentType,
            },
        });

        return orderID;
    } catch (error) {
        throw error;
    }
}
