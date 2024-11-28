export const fetchModel = async (SERVER_URL, id) => {
    const res = await fetch(`${SERVER_URL}/api/models/${id}`);
    const data = await res.json();
    return data;
};

export const createModel = async (SERVER_URL, modelData) => {
    const res = await fetch(`${SERVER_URL}/api/models`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
    });

    const json = await res.json();
    return json;
};

export const updateModel = async (SERVER_URL, id, modelData) => {
    const res = await fetch(`${SERVER_URL}/api/models/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
    });

    const json = await res.json();
    return json;
};