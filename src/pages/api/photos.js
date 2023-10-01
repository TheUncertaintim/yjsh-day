import { getImagesUrls } from "@/lib/datastore";
import { generateUploadURL } from "@/lib/cloud-storage";

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
    // As the project is now archived, submitting new photo is no longer possible
    res.status(405).json({
      message:
        "This website is now archived and no longer accepts new message.\nBut THANK YOU!",
    });

    // << Before Archive >>
    // const body = JSON.parse(req.body);
    // const filename = body.filename;
    // console.log(`Got ${filename} for uploading...`);
    // try {
    //   const [response] = await generateUploadURL(filename);
    //   res.status(200).json(response);
    // } catch (error) {
    //   console.error(
    //     `Failed to upload ${filename} to GCS due to error\n${error}`
    //   );
    //   res.status(500).json({ err: error });
    // }
  } else {
    console.log(`Method ${req.method} is not allowed.`);
    res.status(405).json({ message: "Allowed: [GET, POST]" });
  }
}
