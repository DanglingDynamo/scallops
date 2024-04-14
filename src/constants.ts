export let JWT_SECRET: string | undefined = "";
export let SCALLOPS_ROOT_TOKEN: string | undefined = "";
export let RAZORPAY_API_KEY: string | undefined = "";
export let RAZORPAY_SECRET_KEY: string | undefined = "";

export function loadConstants() {
  JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw Error("JWT_SECRET NOT DEFINED");
  }

  SCALLOPS_ROOT_TOKEN = process.env.SCALLOPS_ROOT_TOKEN;
  if (!SCALLOPS_ROOT_TOKEN) {
    throw Error("SCALLOPS_ROOT_TOKEN NOT DEFINED");
  }

  RAZORPAY_API_KEY = process.env.RAZORPAY_API_KEY;
  if (!RAZORPAY_API_KEY) {
    throw Error("RAZORPAY_API_KEY NOT DEFINED");
  }

  RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;
  if (!RAZORPAY_SECRET_KEY) {
    throw Error("RAZORPAY_SECRET_KEY NOT DEFINED");
  }
}
