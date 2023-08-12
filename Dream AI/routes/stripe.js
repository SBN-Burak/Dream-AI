const express = require('express');
const Stripe = require('stripe');

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.get('/', (req, res) => {
    res.render("billings");
});

router.post('/', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Token',
                    },
                    unit_amount: 1000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/auth/playground`,
        cancel_url: `http://localhost:3000/`,
    });

    res.redirect(session.url);
});

module.exports = router;
