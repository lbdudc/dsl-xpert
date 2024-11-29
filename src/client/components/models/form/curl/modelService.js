
export const testCurl = async (SERVER_URL, curlData) => {

    console.log('curlData', curlData);
    const res = await fetch(`${SERVER_URL}/api/curl/test`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: curlData
        })
    });

    const body = await res.json();

    return {
        ok: body.ok,
        status: body.status,
        text: body.statusText
    }
}