import { SQS } from "@aws-sdk/client-sqs";

export const sqsClient = new SQS({
    region: process.env.REGION || "",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET || "",
    },
});

export async function sendMessage(
    sqs: SQS,
    params: { MessageBody: any; QueueUrl: string },
) {
    try {
        const data = await sqs.sendMessage(params);
        return data;
    } catch (error) {
        console.log(error);
    }
}
