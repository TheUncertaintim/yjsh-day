import { generateUploadURL } from "@/lib/cloudstorage";

export default async function uploadHandler(req, res) {
  const fileName = req.query.file;
  try {
    const [response] = await generateUploadURL(fileName);
    res.status(200).json(response);
  } catch (error) {
    console.error(`Failed to upload ${fileName} to GCS`);
    res.status(500).json({ err: error });
  }
}
