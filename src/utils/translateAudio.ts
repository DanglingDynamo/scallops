import fs from "fs";
import openAIClient from "../lib/open-ai";

export default async function translateAudio(rs: fs.ReadStream) {
    const sttResponse = await openAIClient.audio.translations.create({
        model: "whisper-1",
        file: rs,
    });

    const { text: stt } = sttResponse;

    return stt;
}
