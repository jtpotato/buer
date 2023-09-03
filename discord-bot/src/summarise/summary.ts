async function query(data, env) {
  // load HF_KEY from .env file
  const HF_KEY = env.HF_KEY;
  console.log("[Buer] Sending summary request.")
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
      repetition_penalty: 90,
    }
  };
  const result = await query(data, env);
  console.log(result)
  return result[0].generated_text;
}
