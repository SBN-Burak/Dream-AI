const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static('views'));
app.use(express.static('public'));

// Google OAuth2 (password.js) & (python-shell)
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// Payment (İyzipay)
const payRouter = require("./routes/pay");
app.use("/pay", payRouter);

// Anasayfa
app.get("/", (req, res) => {
    res.render("homepage");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});
