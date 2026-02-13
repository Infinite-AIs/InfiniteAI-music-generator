export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      return res.status(500).json({ error: errorText });
    }

    const arrayBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/wav");
    res.send(Buffer.from(arrayBuffer));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
