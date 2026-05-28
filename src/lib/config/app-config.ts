export const appConfig = {
  name: "CompliPilot",
  description: "AI Compliance & Evidence OS",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081",
  environment: process.env.NEXT_PUBLIC_APP_ENV ?? "local",
} as const;