import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "dfkajkj",
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
