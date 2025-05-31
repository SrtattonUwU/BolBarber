'use strict';

var ShoppingCart = require('../models/shoppingcart');
var Product = require('../models/products');

function addProduct(req, resp) {
    var shoppingCarRequestBody = req.body;
    var newShoppingCart = new ShoppingCart();

    newShoppingCart.userId = shoppingCarRequestBody.userId;
    newShoppingCart.productsList = shoppingCarRequestBody.productsList;
    newShoppingCart.status = shoppingCarRequestBody.status;

    if (!newShoppingCart.userId || !Array.isArray(newShoppingCart.productsList) || 
    newShoppingCart.productsList.length === 0 || newShoppingCart.status == null) {
        return resp.status(400).send({ 'message': 'One or more required variables were not sent' });
    }

    if (newShoppingCart.status == true) {
        let productNames = newShoppingCart.productsList.map(product => product.productName.trim());
    
        Product.find({ productName: { $in: productNames.map(name => new RegExp(`^${name}$`, "i")) } })
            .then(existingProducts => {
                let foundNames = existingProducts.map(p => p.productName);
                let missingProducts = productNames.filter(name => !foundNames.includes(name));

        if (missingProducts.length > 0) {
            return resp.status(400).send({ 'message': 'The following products do not exist in the database', 'missingProducts': missingProducts });
        }

            let totalPrice = 0;
            let stockUpdates = [];
            let insufficientStock = false;

            newShoppingCart.productsList.forEach(item => {
                let product = existingProducts.find(p => p.productName.toLowerCase() === item.productName.toLowerCase());

                if (!product) return;

                let requestedQuantity = item.quantity || 1;

                if (requestedQuantity > product.productStock) {
                    insufficientStock = true;
                } else {
                    totalPrice += requestedQuantity * product.productPrice;
                    stockUpdates.push({
                        updateOne: {
                            filter: { _id: product._id },
                            update: { $inc: { productStock: -requestedQuantity } }
                        }
                    });
                }
            });

            if (insufficientStock) {
                return resp.status(400).send({ 'message': 'Insufficient Stock' });
            }

            newShoppingCart.totalPrice = totalPrice;
            newShoppingCart.totalQuantity = newShoppingCart.productsList.reduce((sum, p) => sum + (p.quantity || 1), 0);

            Product.bulkWrite(stockUpdates)
                .then(() => {
                    newShoppingCart.save()
                        .then(savedCart => {
                            resp.status(200).send({ 
                                'message': 'Shopping cart was added successfully', 
                                'cart': savedCart,
                                'totalToPay': totalPrice 
                            });
                        })
                        .catch(err => {
                            resp.status(500).send({ 'message': 'An error occurred while saving the cart', 'error': err });
                        });
                })
                .catch(err => {
                    resp.status(500).send({ 'message': 'An error occurred while updating stock', 'error': err });
                });

        })
        .catch(err => {
            resp.status(500).send({ 'message': 'Database error while searching for products', 'error': err });
        });
    } else {
        resp.status(500).send({'message': 'Shopping cart doesn\'t exist'});
    }
}

module.exports = {
    addProduct
};
