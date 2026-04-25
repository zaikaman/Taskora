import { getJobApiResponse } from "../../../../lib/api/control-plane";
import { createRouteSupabaseClient, errorResponse, jsonResponse } from "../../_shared";

interface RouteContext {
  params: Promise<{
    jobId: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const client = await createRouteSupabaseClient();
    const { jobId } = await context.params;
    const result = await getJobApiResponse(client, jobId);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
