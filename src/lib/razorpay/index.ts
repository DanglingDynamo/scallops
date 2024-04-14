import Razorpay from "razorpay";
import { RAZORPAY_API_KEY, RAZORPAY_SECRET_KEY } from "../../constants";

export const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_API_KEY || "",
    key_secret: RAZORPAY_SECRET_KEY || "",
});
