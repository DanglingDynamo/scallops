import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fsStorage } from "../lib/firebase";

export default async function uploadToFirebase(path: string, document: Express.Multer.File) {
  const fsStorageRef = ref(fsStorage, path);
  const fsMetadata = {
    contentType: document.mimetype,
  };

  const uploadTask = await uploadBytes(fsStorageRef, document.buffer, fsMetadata);

  try {
    const documentURL = await getDownloadURL(uploadTask.ref);

    return documentURL;
  } catch (error) {
    throw new Error("Failed To Upload Document To Firebase");
  }
}
