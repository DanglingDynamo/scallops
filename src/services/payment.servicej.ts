import { PaymentLinks } from "razorpay/dist/types/paymentLink";
import prisma from "../../prisma";
import { razorpayInstance } from "../lib/razorpay";

export async function createPayment(amount: Number, orderID: String) {
    try {
        // const paymentLink = await razorpayInstance.paymentLink.create({});
        // const payment = prisma.payment.create({
        //   data: {
        //     orderID: orderID.toString(),
        //     amount: amount.valueOf(),
        //   },
        // });
    } catch (error) {
        throw error;
    }
}
