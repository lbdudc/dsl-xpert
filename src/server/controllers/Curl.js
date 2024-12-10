
export default class CurlController {
    // This function receives a CURL command in text format and
    // fetches the URL trying to see if returns a 200 status code
    static async test(req, res) {

        // req receives a text field with the curl command
        const { method, url, body, headers } = req.body
        if (!method || !url) {
            return res.status(400).json({ error: 'Invalid curl command' });
        }

        // Parse the curl command to get the method and the URL
        try {
            const customHeaders = new Headers();
            headers.forEach((header) => {
                customHeaders.append(header.key, header.value);
            });

            // Fetch the URL
            const response = await fetch(url, {
                method,
                headers: customHeaders,
                body: body ? JSON.stringify(body) : null
            });

            const result = await response.json();
            // Return the response status
            res.status(response.status).json({
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                resBody: result
            });
        } catch (error) {
            console.error(error);
            res.status(200).json({
                ok: false,
                error: error.cause
            });
        }
    }

    // static async mock(req, res) {
    //     // mock the response from openAI API
    //     res.status(200).json({
    //         "id": "chatcmpl-abc123",
    //         "object": "chat.completion",
    //         "created": 1677858242,
    //         "model": "gpt-4o-mini",
    //         "usage": {
    //             "prompt_tokens": 13,
    //             "completion_tokens": 7,
    //             "total_tokens": 20,
    //             "completion_tokens_details": {
    //                 "reasoning_tokens": 0,
    //                 "accepted_prediction_tokens": 0,
    //                 "rejected_prediction_tokens": 0
    //             }
    //         },
    //         "choices": [
    //             {
    //                 "message": {
    //                     "role": "assistant",
    //                     "content": "\n\nThis is a test!"
    //                 },
    //                 "logprobs": null,
    //                 "finish_reason": "stop",
    //                 "index": 0
    //             }
    //         ]
    //     });
    // }
}
