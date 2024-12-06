// Copy to clipboard the model output
export const copyToClipboard = async (navigator, text) => {

    // Check if the browser supports the Clipboard API
    if (!navigator.clipboard) {
        console.error("Clipboard API not found");
        return;
    }

    return navigator.clipboard
        .writeText(text)
        .then(() => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

// Replace newline characters with <br> and tab characters with spaces
export const formatText = (text) => {
    return text.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
};