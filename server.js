const express = require('express')
const moment = require('moment')
const { getConnection } = require('./models/dao/connection')
const Clientes = require('./controller/clientes')
const Productos = require('./controller/productos')
const app = express()


//websocket
const http = require("http")
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

//vvvvvvvvvv-BORRAR ESTO-vvvvvvvvvv
const routerProductos = require('./routes/productos')
//^^^^^^^^^^-BORRAR ESTO-^^^^^^^^^^

const PORT = process.env.PORT || 8080

app.use(express.static('public'))


app.use(express.json())
app.use(express.urlencoded({extended: true}))


//vvvvvvvvvv-BORRAR ESTO-vvvvvvvvvv
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended:true}))
app.use('/t',routerProductos)
//^^^^^^^^^^-BORRAR ESTO-^^^^^^^^^^


io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado ${socket.id}`)
    
    const todosLosClientes = await new Clientes().listarClientes()
    const todosLosProductos = await new Productos().listarProductos()


    // socket.emit("todos-mensajes",mensajes) //envio los mensajes a los clientes
    socket.emit("todos-los-clientes",todosLosClientes)
    socket.emit("todos-los-productos",todosLosProductos)

    socket.on('clienteNuevo', async (cliente) => {
        console.log(`se recibio esto: ${JSON.stringify(cliente)}`)
        const nuevocliente = await new Clientes().crearCliente(cliente)
        console.log(`Cliente creado`)

        const refresh = await new Clientes().listarClientes()
        socket.emit("todos-los-clientes",refresh)
    })

    socket.on('clienteBorrar', async (clienteBorrar) => {
        const borrarcliente = await new Clientes().borrarClientes(clienteBorrar)
        console.log(`Cliente borrado`)

        const refresh = await new Clientes().listarClientes()
        socket.emit("todos-los-clientes",refresh)
    })

    socket.on('clientePedido', async (clientePedido) => {
        console.log(`se recibio esto: ${JSON.stringify(clientePedido)}`)
        const clienteProducto = await new Clientes().agregarProducto(clientePedido)
        if (clienteProducto == 'stockError'){
            socket.emit("error-stock") //TODO: POPUP DE ERROR
        }
        const refresh = await new Clientes().listarClientes()
        socket.emit("todos-los-prod-pedidos",refresh)
    })

    socket.on('mostrar-pedidos', async (prodPedidos) => {
        console.log(`se recibio: ${JSON.stringify(prodPedidos)}`)
        const client = await new Clientes().buscarCliente(prodPedidos)
        let totalPedido = 0

        if (prodPedidos != ''){
            const productosPedido = client.productos
            for (i=0; i<productosPedido.length; i++){
                totalPedido = totalPedido + (productosPedido[i].precio * productosPedido[i].cantidad)
            }
            socket.emit("mostrar-prod-pedidos", [productosPedido,totalPedido])
        }
    })

    // socket.on('generar-ticket', async (prodPedidos) =>{
    //     const client = await new Clientes().buscarCliente(prodPedidos)
    //     let totalPedido = 0
    //     if (prodPedidos != ''){
    //         const productosDelPedido = client.productos
    //         console.log(productosDelPedido)
    //         for (i=0; i<productosDelPedido.length; i++){
    //             totalPedido = totalPedido + (productosDelPedido[i].precio * productosDelPedido[i].cantidad)
    //         }
    //         console.log(`total del pedido es ${totalPedido}`)
    //         //socket.emit("mostrar-prod-pedidos", productosDelPedido)
    //     }
    // })

})

//LEVANTO EL SERVER
getConnection().then((message) => { 
    console.log(message);
    server.listen(PORT, () =>{
        console.log(`Listening on port: ${PORT}`);
    });
}).catch(console.log);