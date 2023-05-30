import { Storage } from "@google-cloud/storage";

const storage = new Storage();

const bucketName = "imac-wedding-images";

async function listImages() {
  // Lists files in the bucket

  return await storage.bucket(bucketName).getFiles();
}

async function uploadImage(filePath, destFileName) {
  const options = {
    destination: destFileName,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
  };

  await storage.bucket(bucketName).upload(filePath, options);
  console.log(`${filePath} uploaded to ${bucketName}`);
}

async function downloadImage(fileName) {
  // Downloads the file into a buffer in memory.
  const contents = await storage.bucket(bucketName).file(fileName).download();

  console.log(
    `Contents of gs://${bucketName}/${fileName} are ${contents.toString()}.`
  );
  return contents;
}

async function generateUploadURL(fileName) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
  };
  return file.generateSignedPostPolicyV4(options);
}

export { generateUploadURL, listImages, uploadImage, downloadImage };
