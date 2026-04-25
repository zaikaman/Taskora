import { getPaymentApiResponse } from "../../../../lib/api/control-plane";
import { createRouteSupabaseClient, errorResponse, jsonResponse } from "../../_shared";

interface RouteContext {
  params: Promise<{
    paymentId: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const client = await createRouteSupabaseClient();
    const { paymentId } = await context.params;
    const result = await getPaymentApiResponse(client, paymentId);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
