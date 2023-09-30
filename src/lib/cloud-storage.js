import { Storage } from "@google-cloud/storage";

const storage = new Storage();

const BUCKET_NAME = process.env.BUCKET_NAME;

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

export { generateUploadURL };
