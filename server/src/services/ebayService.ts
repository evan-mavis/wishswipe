import axios from "axios";
import redis from "../utils/redisClient.js";

export async function getEbayAccessToken(): Promise<string> {
  const cachedToken = await redis.get("ebay_access_token");
  if (cachedToken) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("scope", "https://api.ebay.com/oauth/api_scope");

  const result = await axios.post(
    `${process.env.EBAY_BASE_URL}/identity/v1/oauth2/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  const token = result.data.access_token;
  const expiresIn = result.data.expires_in || 7200;
  await redis.set("ebay_access_token", token, "EX", expiresIn - 60);

  return token;
}
