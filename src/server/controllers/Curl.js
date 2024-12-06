
export default class CurlController {
    // This function receives a CURL command in text format and
    // fetches the URL trying to see if returns a 200 status code
    static async test(req, res) {

        // req receives a text field with the curl command
        const curlCommand = req.body.text;
        if (!curlCommand) {
            return res.status(400).json({ error: 'No curl command provided' });
        }

        console.log('curlCommand', curlCommand);

        // Parse the curl command to get the method and the URL
        try {
            const { method, url, headers } = parseCurl(curlCommand);

            // Fetch the URL
            const response = await fetch(url, {
                method,
                headers: {
                    ...headers
                }
            });

            // Return the response status
            console.log('response', response);
            res.json({
                ok: response.ok,
                status: response.status,
                statusText: response.statusText
            });

        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Invalid curl command' });
        }
    }
}


const parseCurl = (curlCommand) => {
    const args = curlCommand.split(/\s+/);
    const method = args.includes('--request') ? args[args.indexOf('--request') + 1] : 'GET';
    const url = args[args.indexOf('--location') + 1] || args.find(arg => arg.startsWith('http'));

    // get the headers
    const headers = new Headers();
    // clean the headers from the command, the blank spaces and simple quotes
    const headerIndex = args.indexOf('--header');

    if (headerIndex !== -1) {
        const headersArray = args.slice(headerIndex + 1);

        headersArray.forEach((header, index) => {
            if (index % 2 === 0) {
                const headerKey = header.replace(/'/g, '');
                const headerValue = headersArray[index + 1].replace(/'/g, '');
                headers.append(headerKey, headerValue);
            }
        });
    }

    const newUrl = url.replace(/'/g, '');

    return { method, url: newUrl, headers };
};
