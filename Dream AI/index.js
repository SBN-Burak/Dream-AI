const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static('views'));
app.use(express.static('public'));

// Stripe
const stripe = require("./routes/stripe");
app.use("/stripe", stripe);

// Google OAuth2 (password.js) & (python-shell)
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// Anasayfa
app.get("/", (req, res) => {
    res.render("homepage");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});
