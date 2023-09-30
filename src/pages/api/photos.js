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
    // As the project is now archived, submitting new photo is no longer possible
    res.status(405).json({
      message:
        "Project is archived. Uploading new photo is no longer supported!",
    });

    // << Before Archive >>
    // const fileName = req.query.file;
    // console.log(`Got ${fileName} for uploading...`);
    // try {
    //   const [response] = await generateUploadURL(fileName);
    //   res.status(200).json(response);
    // } catch (error) {
    //   console.error(
    //     `Failed to upload ${fileName} to GCS due to error\n${error}`
    //   );
    //   res.status(500).json({ err: error });
    // }
  } else {
    console.log(`Method ${req.method} is not allowed.`);
    res.status(405).json({ message: "Allowed: [GET, POST]" });
  }
}
