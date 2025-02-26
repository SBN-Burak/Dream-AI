const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static('views'));
app.use(express.static('public'));

// Google OAuth2 (password.js) & (python-shell)
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// Payment (İyzipay)
//const payRouter = require("./routes/pay");
//app.use("/pay", payRouter);

// Payment (Paytr)
const payRouter = require("./routes/paytr");
app.use("/pay", payRouter);

// Anasayfa
app.get("/", (req, res) => {
    res.render("homepage");
});

// Coinbase denemesi
app.get("/coin", (req, res) => {
    res.redirect("https://commerce.coinbase.com/checkout/.....");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});
