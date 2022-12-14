const express = require('express')
const moment = require('moment')
const { getConnection } = require('./models/dao/connection')
const { PORT } = require('./config/globals')
const Clientes = require('./controller/clientes')
const Productos = require('./controller/productos')
const app = express()


//websocket
const http = require("http")
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)


const routerProductos = require('./routes/rutas')


app.use(express.static('public'))


app.use(express.json())
app.use(express.urlencoded({extended: true}))



routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended:true}))
app.use('/t',routerProductos)



io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado ${socket.id}`)
    
    const todosLosClientes = await new Clientes().listarClientes()
    const todosLosProductos = await new Productos().listarProductos()


    
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
        console.log(`se recibio esto: ${JSON.stringify(clienteBorrar)}`)
        const borrarcliente = await new Clientes().borrarClientes(clienteBorrar)
        console.log(`Cliente borrado`)

        const refresh1 = await new Clientes().listarClientes()
        socket.emit("todos-los-clientes",refresh1)
    })

    socket.on('clientePedido', async (clientePedido) => {
        const error = "no hay stock suficiente"
        const confirm = 'producto cargado exitosamente'
        const clienteProducto = await new Clientes().agregarProducto(clientePedido)
        console.log('ERROR?',clienteProducto)

        if (clienteProducto == 'Error'){
            socket.emit("falta-stock", [error])
        }
        if (clienteProducto != 'Error'){
            socket.emit("confirmation", [confirm])
        }
    })

    socket.on('mostrar-pedidos', async (prodPedidos) => {
        const client = await new Clientes().buscarCliente(prodPedidos)
        let totalPedido = 0
        let nowDate = moment().format('DD/MM/YYYY');
        let estado = 'Pedido en curso'

        if (prodPedidos != ''){
            const productosPedido = client.productos
            for (i=0; i<productosPedido.length; i++){
                totalPedido = totalPedido + (productosPedido[i].precio * productosPedido[i].cantidad)
            }
            socket.emit("mostrar-prod-pedidos", [productosPedido,totalPedido, nowDate, estado])
        }
    })

    socket.on('finalizar-pedido', async (clientePedido) => {
        const confirmaFin = 'Pedido fue finalizado con exito'
        const errorFinPedido = 'Error, no se puede cerrar pedido sin productos'
        console.log(`se recibio esto: ${JSON.stringify(clientePedido)}`)
        const finPedido = await new Clientes().finalizarPedidoCliente(clientePedido)
        if (finPedido == 'error'){
            socket.emit("error-fin-pedido", [errorFinPedido])
        }else{
            socket.emit("pedido-finalizado", [confirmaFin])
        }
    })

})

//LEVANTO EL SERVER
getConnection().then((message) => { 
    console.log(message);
    server.listen(PORT, () =>{
        console.log(`Listening on port: ${PORT}`);
    });
}).catch(console.log);