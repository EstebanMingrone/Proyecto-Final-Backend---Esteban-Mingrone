import express from 'express';
import { io } from '../app';
import fs from 'fs/promises';

const cart = express.Router();
const cartPath = './cart.json';

cart.post('/', async (req, res) => {
    const newCart = req.body
    newCart.id = await newCartID();
    newCart.products = [];
    await saveCart(newCart);
    io.emit('updateCart');
    res.json(newCart);
});

cart.get('/:cid', async (req, res) => {
    const cartID = parseInt(req.params.cid);
    const cart = await getCart(cartID)
    if(cart){
        res.json(cart.products);
    } else{
        res.status(404).json({ error: 'No se pudo encontrar el carrito' })
    }
});

cart.post('/:cid/product/:pid', async (req, res) => {
    const cartID = parseInt(req.params.cid)
    const productID = parseInt(req.params.pid)
    const cart = await getCart(cartID);
    const productIndex = cart.products.findIndex(product => product.id === productID);
    if (productIndex !== -1){
        cart.products[productIndex].quantity++;
    } else{
        cart.products.push({id: productID, quantity: 1});
    }
    await saveCart(cart)
    io.emit('updateCart')
    res.json(cart)
});

async function getCart(cartID){
    const data = await fs.readFile(cartPath, 'utf-8')
    const carts = JSON.parse(data)
    return carts.find(cart => cart.id === cartID)
}

async function saveCart(cart){
    const data = await fs.readFile(cartPath, 'utf-8')
    const carts = JSON.parse(data);
    const cartIndex = carts.findIndex(c => c.id === cart.id)
     if (cartIndex !== -1){
        carts[cartIndex] = cart;
     } else{
        carts.push(cart)
     }
     await fs.writeFile(cartPath, JSON.stringify(carts, null, 2), 'utf-8');  
}

async function newCartID(){
    const carts = await getCarts();
    const maxID = carts.reduce((max, cart)=> Math.max(max, cart.id), 0);
    return maxID + 1;
}

export default cart;