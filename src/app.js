import express from "express";
import products from './routes/products.js';
import cart from './routes/cart.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', products);
app.use('/api/cart', cart);

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server listening on port:  ${PORT}`)
})


