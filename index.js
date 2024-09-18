const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express")
const cors = require("cors");
const app = express()
require('dotenv').config()
app.use(express.json());

app.use(cors({
    origin: "*",
    allowedHeaders: ['Content-Type', 'Authorization']
}));
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).send('Something broke!');
}
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
app.get("/api/generate-story", async function (req, res) {
    const prompt = "write a really short story of 2 paragraphs with more than one characters with there names";
    try {
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() })
        console.log(result.response.text());
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "something went wrong" });
    }
})
app.post("/api/send-prompt", async function (req, res) {
    console.log("reached to backend")
    const prompt = req.body.prompt + "return the array of name of characters in story in string format and dont include bold letters";
    try {
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() })
        console.log(result.response.text());
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "something went wrong" });
    }

})
app.post("/api/role", async function (req, res) {
    console.log("getting role")
    console.log(req.body.character)
    const { character, prompt, question } = req.body;
    const fullprompt = `Act as ${character} in this story: ${prompt}. Now answer this question: ${question} and keep it short`;
    try {
        const result = await model.generateContent(fullprompt);
        res.json({ answer: result.response.text() })
        console.log(result.response.text());
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "something went wrong" });
    }
})
app.use(errorHandler);
app.listen(8000, () => {
    console.log("Server running..");
});