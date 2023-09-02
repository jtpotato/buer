// load HF_KEY from .env file
const HF_KEY = process.env.HF_KEY;

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/Mapcar/pegasus-samsum",
		{
			headers: { Authorization: `Bearer ${HF_KEY}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

async function summarise(text) {
    const data = {
        inputs: text,
        parameters: {
            min_length: 50,
            max_length: 200,
            length_penalty: 2.0,
            early_stopping: true,
        },
    };

    const result = await query(data);
    return JSON.stringify(result);
}

module.exports = { summarise };
