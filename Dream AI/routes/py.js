const express = require("express");
const router = express.Router();

const { PythonShell } = require("python-shell");
const bodyParser = require('body-parser');

require('dotenv').config();

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

// Python Replicate Call //
router.post("/", (req, res) => {
    try {
        const { ruyatextarea } = req.body;
        const options = {
            pythonPath: 'python',
            args: [ruyatextarea], // Pass the user input as an argument to the Python script
        };
        // Run the Python script using python-shell
        PythonShell.run('main.py', options).then(messages => {
            const outputText = messages.join('\n');
            res.render("homepage", { outputText });
            console.log(outputText)
        });
    } catch (error) {
        console.error('Error while calling Python:', error);
        res.status(500).send('An error occurred while calling Python.');
    }

});
////////////////////////////

module.exports = router;
