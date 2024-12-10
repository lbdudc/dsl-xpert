import { SERVER_URL } from "@consts/server";

export const testCurl = async (request) => {
    const { method, url, body, headers } = request;

    try {
        const res = await fetch(`${SERVER_URL}/api/curl/test`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                method,
                url,
                body,
                headers
            })
        });
        const result = await res.json();
        console.log(result);
        return {
            ok: result.ok,
            status: result.ok ? result?.status : "error",
            text: result.ok ? result?.statusText : result?.error,
            body: result?.resBody,
            error: result?.error
        }
    } catch (error) {
        return {
            ok: false,
            error: error.cause
        };
    }
}