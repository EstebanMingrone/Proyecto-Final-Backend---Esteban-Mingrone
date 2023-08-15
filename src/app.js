import express from "express";
import products from './routes/products.js';
import cart from './routes/cart.js';
import handlebars from 'express-handlebars';
import __dirname from "./utils.js";
import http from 'http';
import socketIo from 'socket.io';


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'))

io.on('conected', (socket)=>{
    console.log('Usuario Conectado')

    socket.on('disconnected', ()=>{
        console.log('Usuario desconectado')
    })
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', products);
app.use('/api/cart', cart);

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server listening on port:  ${PORT}`)
})

export {app, io};


