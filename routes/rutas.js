const express = require('express')
const path = require('path')
const Clientes = require('../controller/clientes')
const Productos = require('../controller/productos')


const routerProductos = express.Router()

// module.exports = routerProductos.get('/productos', (req,res) => {
//     if (productos.listaProductos.length == 0){
//         res.send({error: 'no hay productos cargados'})
//     } else {
//         res.render('lista_productos',{productos:productos.listaProductos})
//     }
// })

// module.exports = routerProductos.post('/productos', (req,res) => {
//     let nuevoProducto = {
//         'title' : req.body.title,
//         'price' : req.body.price,
//         'thumbnail' : req.body.thumbnail,
//         'id' : productos.listaProductos.length + 1
//     }
//     productos.listaProductos.push(nuevoProducto)
//     res.redirect('/productos')
// })

module.exports = routerProductos.get('/users', async (req,res) => {
    const todosLosClientes = await new Clientes().listarClientes()
    res.send(todosLosClientes)
})

module.exports = routerProductos.get('/productos', async (req,res) => {
    const todosLosProductos = await new Productos().listarProductos()
    res.send(todosLosProductos)
})

module.exports = routerProductos.post('/prod', async (req,res) => {
    const productoNuevo = await new Productos().crearProducto({nombre: req.body.nombre, precio: req.body.precio, stock: req.body.stock})
    res.send(`producto creado`)
})




module.exports = routerProductos