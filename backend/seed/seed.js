const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

const REGION = process.env.AWS_REGION || "ap-south-1";
const STAGE = process.env.STAGE || "prod";
const DATA_DIR = path.resolve(__dirname, "../../public/data");

const s3 = new S3Client({ region: REGION });
const sts = new STSClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

async function main() {
  const { Account } = await sts.send(new GetCallerIdentityCommand({}));
  const bucket = `itfarmer-content-${STAGE}-${Account}`;
  const table = `itfarmer-inquiries-${STAGE}`;

  console.log(`Seeding content -> s3://${bucket}`);
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json") && f !== "inquiries.json");

  for (const file of files) {
    const key = file;
    const body = fs.readFileSync(path.join(DATA_DIR, file));
    try {
      await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      console.log(`  SKIP ${key} (already exists)`);
      continue;
    } catch (error) {
      if (error.name !== "NotFound") {
        console.error(`  SKIP ${key}: ${error.message}`);
        continue;
      }
    }
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "application/json",
      })
    );
    console.log(`  UPLOADED ${key}`);
  }

  console.log(`Seeding inquiries -> ${table}`);
  const inquiriesPath = path.join(DATA_DIR, "inquiries.json");
  if (fs.existsSync(inquiriesPath)) {
    const inquiries = JSON.parse(fs.readFileSync(inquiriesPath, "utf-8"));
    for (const inquiry of Array.isArray(inquiries) ? inquiries : []) {
      if (!inquiry || !inquiry.id) continue;
      const existing = await ddb.send(new ScanCommand({
        TableName: table,
        FilterExpression: "id = :id",
        ExpressionAttributeValues: { ":id": String(inquiry.id) },
      }));
      if (existing.Items.length > 0) {
        console.log(`  SKIP inquiry ${inquiry.id} (exists)`);
        continue;
      }
      await ddb.send(
        new PutCommand({
          TableName: table,
          Item: {
            id: String(inquiry.id),
            timestamp: inquiry.timestamp || new Date().toISOString(),
            ...inquiry,
          },
        })
      );
      console.log(`  INSERTED inquiry ${inquiry.id}`);
    }
    if (!Array.isArray(inquiries) || inquiries.length === 0) {
      console.log("  no inquiries to seed");
    }
  }

  console.log("Seeding complete.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
