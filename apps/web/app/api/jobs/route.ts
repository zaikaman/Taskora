import { createJobApiResponse, listJobsApiResponse } from "../../../lib/api/control-plane";
import { createRouteSupabaseClient, errorResponse, jsonResponse } from "../_shared";

export async function POST(request: Request) {
  try {
    const client = await createRouteSupabaseClient();
    const result = await createJobApiResponse(client, await request.json());
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const client = await createRouteSupabaseClient();
    const result = await listJobsApiResponse(client);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
