import { generateUploadURL } from "@/lib/cloudstorage";

export default async function uploadHandler(req, res) {
  const fileName = req.query.file;
  const [response] = await generateUploadURL(fileName);
  res.status(200).json(response);
}
