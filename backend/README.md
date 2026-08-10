# ITFarmer Serverless Backend

AWS Lambda + API Gateway serverless backend for ITFarmer, built with the Serverless Framework.

## Resources

- **API Gateway** REST API (region `ap-south-1`, stage `prod`)
- **Lambda** (Node.js 22):
  - `chat` — `POST /chat` AI assistant proxy (Groq, key from SSM)
  - `dataGet` — `GET /data/{file}` read content JSON from S3
  - `dataSave` — `PUT /data/{file}` write content JSON to S3
  - `inquiryList` — `GET /inquiries`
  - `inquirySubmit` — `POST /inquiries`
  - `inquiryClear` — `DELETE /inquiries`
  - `inquiryDelete` — `DELETE /inquiries/{id}`
  - `adminAuth` — `POST /auth` admin password check
- **S3 bucket** `itfarmer-content-{stage}-{accountId}` — content JSON files
- **DynamoDB table** `itfarmer-inquiries-{stage}` — inquiry records (PK: `id`)

## Secrets (SSM Parameter Store)

- `/itfarmer/GROQ_API_KEY` (SecureString)
- `/itfarmer/ADMIN_PASSWORD` (SecureString)

## Commands

```bash
npm install                 # dev-only deps for the seed script
npm run deploy:prod         # serverless deploy --stage prod
npm run seed                # migrate public/data/*.json into S3 + DynamoDB
```

## Frontend integration

Set the frontend env var to the deployed API base URL:

```
NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.ap-south-1.amazonaws.com/prod
```

The API mirrors the routes the Next.js app already uses (`/chat`, `/data/{file}`, `/inquiries`, `/auth`), so the frontend can be pointed at it via `NEXT_PUBLIC_API_URL` when ready.
