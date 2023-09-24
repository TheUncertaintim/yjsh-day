import { generateUploadURL } from "@/lib/cloud-storage";
import { getImagesUrls } from "@/lib/datastore";

export default async function uploadHandler(req, res) {
  if (req.method === "GET") {
    // return a list of urls (which point to photo and its thumbnail) form Datastore
    try {
      const [listOfUrls] = await getImagesUrls();
      res.status(200).json(listOfUrls);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to fetch photos due to error\n${error}` });
    }
  } else if (req.method === "POST") {
    const fileName = req.query.file;
    console.log(`Got ${fileName} for uploading...`);
    try {
      const [response] = await generateUploadURL(fileName);
      res.status(200).json(response);
    } catch (error) {
      console.error(
        `Failed to upload ${fileName} to GCS due to error\n${error}`
      );
      res.status(500).json({ err: error });
    }
  } else {
    console.log(`Method ${req.method} is not allowed.`);
    res.status(405).end({ message: "Allowed: [GET, POST]" });
  }
}
