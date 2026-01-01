import { NextRequest, NextResponse } from "next/server";
import RouteError from "../error/routeError";

export function withLoggingAndErrorHandling(
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
    return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
        try {
            console.log(`[Start] ${request.method} ${request.url}`);
            const response = await handler(request, ...args);
            return response;
        } catch (error) {
            console.error("[Error in Route Handler]", error);
            if (error instanceof RouteError) {
                return NextResponse.json(
                    { error: error.message },
                    { status: error.statusCode }
                );
            }
            return NextResponse.json(
                {
                    error: "An unexpected error occurred",
                    message: error instanceof Error ? error.message : String(error),
                },
                { status: 500 }
            );
        } finally {
            console.log(`[End] ${request.method} ${request.url}`);
        }
    };
}
