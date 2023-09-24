import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET_NAME = "imac-wedding-images";

/** Generate a signed URL for uploading a given file to GCS */
function generateUploadURL(fileName) {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(fileName);
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
  };
  // return a signed url
  return file.generateSignedPostPolicyV4(options);
}

/** NOT IN USED */
function listImages() {
  // Lists files in the bucket

  return storage.bucket(BUCKET_NAME).getFiles();
}

/** NOT IN USED */
function uploadImage(filePath, destFileName) {
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

  return storage.bucket(BUCKET_NAME).upload(filePath, options);
}

/** NOT IN USED */
function downloadImage(fileName) {
  // Downloads the file into a buffer in memory.
  return storage.bucket(BUCKET_NAME).file(fileName).download();
}

export { generateUploadURL, listImages, uploadImage, downloadImage };
