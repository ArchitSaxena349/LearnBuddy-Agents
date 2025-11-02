import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/gpt', async (req, res) => {
  const prompt = req.body.prompt;
  

  // Send to OpenAI
  const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You help find search keywords for 3D models." },
        { role: "user", content: `User wants to see: ${prompt}. Return a simple keyword for searching a model.` }
      ]
    })
  });

  const gptData = await gptResponse.json();
  const keyword = gptData.choices[0].message.content.trim();

  // Example fallback model (replace with Meshy API or your own logic)
  const fallbackModel = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb";

  // TODO: connect to Meshy/Sketchfab here using keyword
  res.json({ modelUrl: fallbackModel });
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
