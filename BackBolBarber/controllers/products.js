'use strict'

var Product = require('../models/products');

function createProduct(req, resp) {
    var productRequestBody = req.body;
    var newProduct = new Product();

    newProduct.productName = productRequestBody.productName;
    newProduct.productDescription = productRequestBody.productDescription;
    newProduct.productPrice = productRequestBody.productPrice;
    newProduct.productStock = productRequestBody.productStock;

    if (
        newProduct.productName === null || newProduct.productName.trim() === ''
        || newProduct.productDescription === null || newProduct.productDescription.trim() === ''
        || newProduct.productPrice === null || newProduct.productPrice <= 0
        || newProduct.productStock === null || newProduct.productStock <= 0
    ) {
            resp.status(400).send({'message': 'One or more required variables were not sent'})
    }

    if (req.user.role === "Administrator") {
        newProduct.save().then(
            (savedProduct) => {
                resp.status(200).send({'message': 'Product was created succesfully', 'user': savedProduct});
            },
            err => {
                resp.status(500).send({'message': 'An error ocurred while creating the product', 'error': err});
            }
        );
    }
    else{
        resp.status(400).send({'message': 'Only administrators can create products'})
    }
}

function editProduct(req, resp) {
    var productToEdit = req.params._id;
    var newProductToEdit = req.body;

    var product = new Product();

    product._id = productToEdit;
    product.productName = newProductToEdit.productName;
    product.productDescription = newProductToEdit.productDescription;
    product.productPrice = newProductToEdit.productPrice;
    product.productStock = newProductToEdit.productStock;

    if (req.user.role === "Administrator") {
        Product.findByIdAndUpdate(product._id, product, {new : true}).then(
            (editedProduct) => {
                resp.status(200).send({'message': 'Product was edited succesfully', 'product': editedProduct});
            },
            err => {
                resp.status(500).send({'message': 'An error ocurred while editing the product', 'error': err});
            }
        );
    } else {
        resp.status(200).send({'message': 'Only administrators can update products'});
    }
}

function findAllProducts(req, resp) {
    Product.find().then(
        (foundProducts) => {
            resp.status(200).send({'products': foundProducts});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while searching the products', 'error': err});
        }
    );
}

function deleteProduct(req, resp) {
    var productToDelete = req.params._id;

    if (req.user.role === "Administrator"){
        Product.findByIdAndDelete(productToDelete).then(
            (deletedProduct) => {
                resp.status(200).send({'message': 'Product was deleted succesfully', 'product': deletedProduct});
            },
            err => {
                resp.status(500).send({'message': 'An error ocurred while deleting the product', 'error': err});
            }
        ); 
    } else {
        resp.status(500).send({'message': 'Only administrators can delete a product'});
    }

}

module.exports = {
    createProduct, editProduct, findAllProducts, deleteProduct
}
