import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle";
import { username } from "better-auth/plugins"
import * as schema from "../../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    username()
  ],
  trustedOrigins: ["http://localhost:5173"],
  advanced: {
    useSecureCookies: false,
    crossSubDomainCookies: {
      enabled: false
    }
  }
})