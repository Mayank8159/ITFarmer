const { json } = require("./lib/response");

exports.handler = async (event) => {
  try {
    const { password } = JSON.parse(event.body || "{}");
    const success = typeof password === "string" && password === process.env.ADMIN_PASSWORD;
    return json(200, { success });
  } catch (error) {
    console.error("Auth error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};
