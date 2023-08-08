import express from 'express';
import fs from 'fs/promises';

const products = express.Router();
const productsPath = './products.json'

products.get('/', async (req, res)=>{
    const limit = parseInt(req.query.limit)
    const products = await getProducts();
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.json(limitedProducts)
});

products.get('/:pid', async (req, res)=>{
    const productID = parseInt(req.params.pid);
    const products = await getProducts();
    const product = products.find(product => product.id === productID);
    if (product){
        res.json(product)
    } else {
        res.status(404).json({error: 'No se encuentra el producto'})
    }
})

products.post('/', async (req,res)=>{
    const newProduct = req.body;
    const products = await getProducts();
    newProduct.id = newID(products);
    products.push(newProduct)
    await saveProducts(products)
    res.json(newProduct)
})

products.put('/:pid', async (req, res)=>{
    const productID = parseInt(req.params.pid);
    const updatedFields = req.body
    const products = await getProducts();
    const productIndex = products.findIndex(product => product.id === productID)
    if (productIndex !== -1){
        products[productIndex] = {...products[productIndex], ...updatedFields}
        await saveProducts(products)
        res.json(products[productIndex])
    } else{
        res.status(404).json({error: 'No se encuentra el producto'})
    }
})

products.delete('/:pid', async (req,res)=>{
    const productID = parseInt(req.params.pid);
    const products = await getProducts();
    const updatedProducts= products.filter(product => product.id !== productID);
    if (products.length !== updatedProducts.length){
        await saveProducts(updatedProducts)
        res.json({message: 'Producto eliminado con éxito'})
    } else{
        res.status(404).json({error: 'No se encuentra el producto'})
    }
});

async function getProducts(){
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data)
}

async function saveProducts(products){
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8')
}

const newID = (products)=>{
    const maxID= products.reduce((max, product)=> Math.max(max, product.id), 0)
    return maxID + 1;
}

export default products;

