import fs from "fs";
import os from "os";
import tmp from "tmp";

export default async function saveToTemporaryDir(file: Express.Multer.File) {
  const tempFilePath = tmp.tmpNameSync({
    dir: os.tmpdir(),
    prefix: "scallops-",
    postfix: `.${file.originalname.split(".").pop()}`,
  });

  let rs: fs.ReadStream | null = null;
  try {
    fs.writeFileSync(tempFilePath, file.buffer);
    rs = fs.createReadStream(tempFilePath);

    return rs;
  } catch (error) {
    console.error(`error: ${error}`);
    throw new Error("Failed To Save File To Temporary Directory");
  }
}
