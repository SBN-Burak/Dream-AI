const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static('views'));
app.use(express.static('public'));

// Ödeme Formu
//const billingsRouter = require("./routes/billings");
//app.use("/billings", billingsRouter);

// Python Kodu
const pyRouter = require("./routes/py");
app.use("/py", pyRouter);

// Google OAuth2 (password.js)
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// Anasayfa
app.get("/", (req, res) => {
    res.render("homepage");
});

// Playground
app.get("/playground", (req, res) => {
    res.render("playground");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});
