import { NextRequest, NextResponse } from "next/server";
import RouteError from "../error/routeError";

export function withLoggingAndErrorHandling(
    handler: (request: NextRequest) => Promise<NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        try {
            console.log(`[Start] ${request.method} ${request.url}`);
            const response = await handler(request);
            return response;
        } catch (error) {
            console.error("[Error in Route Handler]", error);
            if (error instanceof RouteError) {
                return NextResponse.json(
                    { message: error.message },
                    { status: error.statusCode }
                );
            }
            return NextResponse.json(
                {
                    message: "An unexpected error occurred",
                    error: error instanceof Error ? error.message : error,
                },
                { status: 500 }
            );
        } finally {
            console.log(`[End] ${request.method} ${request.url}`);
        }
    };
}
