export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod"
).replace(/\/+$/, "");
