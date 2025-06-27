import axios from "axios";
import { getEbayAccessToken } from "./ebayTokenService.js";

export async function searchEbayItems(
  query: string,
  options: { limit?: number; offset?: number } = {}
) {
  const accessToken = await getEbayAccessToken();

  const params = new URLSearchParams();
  params.append("q", query);

  if (options.limit) params.append("limit", options.limit.toString());
  if (options.offset) params.append("offset", options.offset.toString());

  const response = await axios.get(
    `${
      process.env.EBAY_BASE_URL
    }/buy/browse/v1/item_summary/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
