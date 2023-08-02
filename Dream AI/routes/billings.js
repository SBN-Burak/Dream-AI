const express = require("express");
const router = express.Router();

const Iyzipay = require("iyzipay");

// IYZICO API CALLS //
var iyzipay = new Iyzipay({
    apiKey: "sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI",
    secretKey: "sandbox-wbwpzKIiplZxI3hh5ALI4FJyAcZKL6kq",
    uri: 'https://sandbox-api.iyzipay.com'
});

var request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: '1',
    paidPrice: '10',
    currency: Iyzipay.CURRENCY.TRY,
    basketId: 'B67832',
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: 'https://www.merchant.com/callback',
    enabledInstallments: [2, 3, 6, 9],
    buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@email.com',
        identityNumber: '74300864791',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
    },
    billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
    },
    basketItems: [
        {
            id: 'BI101',
            name: 'Binocular',
            category1: 'Collectibles',
            category2: 'Accessories',
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: '0.3'
        }
    ]
};
router.get("/", (req, res) => {
    iyzipay.checkoutFormInitialize.create(request, function (err, result) {
        console.log(result);
        res.render("billings");
    });
});
////////////////////////////

module.exports = router;
