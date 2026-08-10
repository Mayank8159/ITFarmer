const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { json } = require("./lib/response");
const crypto = require("crypto");

const s3 = new S3Client();
const BUCKET = process.env.CONTENT_BUCKET;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const base64Data = body.file;
    const mimeType = body.mimeType || "image/jpeg";
    const extension = mimeType.split('/')[1] || "jpg";

    if (!base64Data) {
      return json(400, { error: "No file provided" });
    }

    // Strip the data:image/jpeg;base64, prefix if it exists
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");
    
    // Generate unique filename
    const filename = crypto.randomBytes(16).toString("hex") + "." + extension;
    const key = `uploads/${filename}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    // The S3 public URL format
    const region = process.env.AWS_REGION || "ap-south-1";
    const publicUrl = `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`;

    return json(200, { success: true, filePath: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};
