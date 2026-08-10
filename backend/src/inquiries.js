const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { json } = require("./lib/response");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());
const TABLE = process.env.INQUIRIES_TABLE;

exports.list = async () => {
  try {
    const { Items = [] } = await ddb.send(new ScanCommand({ TableName: TABLE }));
    Items.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    return json(200, Items);
  } catch (error) {
    console.error("List inquiries error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};

exports.submit = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");
    const item = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
    return json(200, { success: true, id: item.id });
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};

exports.remove = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { error: "Missing inquiry id" });

  try {
    await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    return json(200, { success: true });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};

exports.clear = async () => {
  try {
    const { Items = [] } = await ddb.send(new ScanCommand({ TableName: TABLE }));
    for (let i = 0; i < Items.length; i += 25) {
      const chunk = Items.slice(i, i + 25);
      await ddb.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE]: chunk.map((item) => ({ DeleteRequest: { Key: { id: item.id } } })),
          },
        })
      );
    }
    return json(200, { success: true, deleted: Items.length });
  } catch (error) {
    console.error("Clear inquiries error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};
