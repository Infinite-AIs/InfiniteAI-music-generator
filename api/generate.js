export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/musicgen-small",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt
      })
    }
  );

  const arrayBuffer = await response.arrayBuffer();

  res.setHeader("Content-Type", "audio/wav");
  res.send(Buffer.from(arrayBuffer));
}
