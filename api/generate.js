export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).send("No prompt provided");

    if (!process.env.HF_TOKEN)
      return res.status(500).send("HF_TOKEN not set in Vercel");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    const contentType = response.headers.get("content-type");

    if (!contentType) {
      return res.status(500).send("No content-type returned from HF");
    }

    if (contentType.includes("application/json")) {
      const json = await response.json();
      return res.status(500).send("Hugging Face error: " + JSON.stringify(json));
    }

    const buffer = await response.arrayBuffer();

    if (buffer.byteLength < 10000) {
      return res.status(500).send("Audio too small — model may still be loading");
    }

    res.setHeader("Content-Type", "audio/wav");
    res.send(Buffer.from(buffer));
  } catch (err) {
    conso
