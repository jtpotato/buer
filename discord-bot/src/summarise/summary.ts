async function query(data, env) {
  // load HF_KEY from .env file
  const HF_KEY = env.HF_KEY;
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

export async function summarise(text, env) {
  const data = {
    inputs: text,
    parameters: {
      min_length: 50,
      max_length: 200,
      length_penalty: 2.0,
      early_stopping: true,
    },
  };

  const result = await query(data, env);
  return result[0].generated_text;
}
