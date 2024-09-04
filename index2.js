import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const base = "https://v2.jokeapi.dev";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Default route
app.get("/", (req, res) => {
    res.render("index.ejs", { content: "Welcome! Submit the form to get a joke.", joke: '', delivery: '' });
});

// Joke submission route
app.post("/submit", async (req, res) => {
    const name = req.body.name;
    const categories = Array.isArray(req.body.cat) ? req.body.cat.join(',') : req.body.cat || '';
    const categorySelect = req.body.categoryselect === "multi" ? categories : req.body.categoryselect || "Any";
    const flags = Array.isArray(req.body.flag) ? req.body.flag.join(',') : req.body.flag || '';
    const jokeTypes = Array.isArray(req.body.type) ? req.body.type.join(',') : req.body.type || '';
    const searchString = req.body.search || name || '';

    console.log('Category Select:', categorySelect);
    console.log('Flags:', flags);
    console.log('Joke Types:', jokeTypes);
    console.log('Search String:', searchString);
    console.log('Name:', name);

    try {
        // Fetch joke from the Joke API
        const response = await axios.get(`${base}/joke/${categorySelect}`, {
            params: {
                blacklistFlags: flags,
                type: jokeTypes,
                contains: searchString,
            }
        });

        console.log(response.data);
        res.render("index.ejs", {
            content: JSON.stringify(response.data),
            joke: response.data.joke ? response.data.joke : response.data.setup,
            delivery: response.data.delivery ? response.data.delivery : ''
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("index.ejs", {
            content: "An error occurred. Please try again later.",
            joke: '',
            delivery: ''
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
