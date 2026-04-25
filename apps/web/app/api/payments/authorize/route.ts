import { authorizePaymentApiResponse } from "../../../../lib/api/control-plane";
import { createRouteSupabaseClient, errorResponse, jsonResponse } from "../../_shared";

export async function POST(request: Request) {
  try {
    const client = await createRouteSupabaseClient();
    const result = await authorizePaymentApiResponse(client, await request.json());
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
