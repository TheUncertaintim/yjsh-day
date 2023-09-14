import { generateUploadURL } from "@/lib/cloud-storage";

export default async function uploadHandler(req, res) {
  const fileName = req.query.file;
  console.log(`Got ${fileName} for uploading...`);
  try {
    const [response] = await generateUploadURL(fileName);
    res.status(200).json(response);
  } catch (error) {
    console.error(`Failed to upload ${fileName} to GCS due to error\n${error}`);
    res.status(500).json({ err: error });
  }
}
