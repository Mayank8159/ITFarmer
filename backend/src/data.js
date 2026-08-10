const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const { json } = require("./lib/response");

const s3 = new S3Client();
const BUCKET = process.env.CONTENT_BUCKET;

async function readJson(key) {
  try {
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    return JSON.parse(await Body.transformToString());
  } catch (error) {
    return null;
  }
}

exports.getFile = async (event) => {
  const file = event.pathParameters?.file;
  if (!file || !/^[a-zA-Z0-9_-]+$/.test(file)) {
    return json(400, { error: "Invalid file name" });
  }

  try {
    const content = await readJson(`${file}.json`);
    if (content === null) return json(404, { error: "Not found" });
    return json(200, content);
  } catch (error) {
    console.error("Get data error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};

exports.saveFile = async (event) => {
  const file = event.pathParameters?.file;
  if (!file || !/^[a-zA-Z0-9_-]+$/.test(file)) {
    return json(400, { error: "Invalid file name" });
  }

  try {
    const body = JSON.parse(event.body || "null");
    if (body === null) return json(400, { error: "Invalid JSON body" });

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${file}.json`,
        Body: JSON.stringify(body, null, 2),
        ContentType: "application/json",
      })
    );
    return json(200, { success: true });
  } catch (error) {
    console.error("Save data error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};
