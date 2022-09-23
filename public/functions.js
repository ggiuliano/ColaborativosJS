const socket = io.connect()

//genero el HTML para mostrar el mail de cada cliente en el front
var templateClientes = Handlebars.compile(`
    <option value="" disabled selected>Seleccionar Cliente</option>
    {{# each clientes }}
    <option value={{this.id}}>{{this.email}}</option>
    {{/each}}
`)

var templateProductos = Handlebars.compile(`
    <option value="" disabled selected>Seleccionar Producto</option>
    {{# each productos }}
    <option value={{this.id}}>{{this.nombre}}</option>
    {{/each}}
`)

var templatePedidos = Handlebars.compile(`
        {{#each pedido}}
        <tr>
          <td>{{this.nombre}}</td>
          <td>{{this.precio}}</td>
          <td>{{this.cantidad}}</td>
        </tr>
        {{/each}}
`)

var templatetotal = Handlebars.compile(`
          <label style="font-weight:bold">Total: {{total}}</label>
`)

var templateDate = Handlebars.compile(`
          <label style="font-weight:bold">Fecha: {{date}}</label>
`)

var templateEstado = Handlebars.compile(`
          <label style="font-weight:bold; font-style: italic">Estado: {{estado}}</label>
`)

var templateError = Handlebars.compile(`
        <label style="font-weight:bold; color: red;">{{error}}</label>
`)

var templateConfirm = Handlebars.compile(`
        <label style="font-weight:bold; color: green;">{{confirm}}</label>
`)

var templateErrorFin = Handlebars.compile(`
        <label style="font-weight:bold; color: red;">{{errorFin}}</label>
`)

var templateConfirmFin = Handlebars.compile(`
        <label style="font-weight:bold; color: green;">{{pedidoFin}}</label>
`)

var templateRefresh1 = Handlebars.compile(`
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
`)

var templateRefresh2 = Handlebars.compile(`
        <label></label>
`)

//funcion para guardar un cliente en la BD cargado mediante el form
function guardarCliente(){
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const dni = document.getElementById("dni");
    const email = document.getElementById("email");
  
    socket.emit("clienteNuevo", { nombre: nombre.value, apellido: apellido.value , dni: dni.value, email: email.value});
    nombre.value = "";
    apellido.value = "";
    dni.value = "";
    email.value = "";
    return false; //para que no siga el evento y no quede en loop
}

function borrarCliente(){
    let selectElement = document.querySelector('#listaClientes')
    const clienteBorrar = selectElement.value
    
    socket.emit("clienteBorrar", clienteBorrar)
    return false;
}

function sumarProducto(){
    let cliente = document.querySelector('#listaClientes2')
    const clientePedido = cliente.value

    let prod = document.querySelector('#listaProductos')
    const productoCliente = prod.value

    let cant = document.getElementById("cantidad")
    const cantidadProducto = cant.value

    socket.emit("clientePedido", {clienteID: clientePedido, productoID: productoCliente, cantidadProd: cantidadProducto})
    return false;
}

function mostrarPedido(){
    let cliente = document.querySelector('#listaClientes2')
    const clientePedido = cliente.value

    socket.emit("mostrar-pedidos", clientePedido)
}

function generarTicket(){
    let cliente = document.querySelector('#listaClientes2')
    const clientePedido = cliente.value

    socket.emit("generar-ticket", clientePedido)
}

function finalizarPedido(){
    let cliente = document.querySelector('#listaClientes2')
    const clientePedido = cliente.value

    socket.emit("finalizar-pedido", clientePedido)
}


//funcion para mostrar todos los clientes en el front
function mostrarTodosClientes(clientes){
    let elHtml = templateClientes({clientes:clientes})
    $("#listaClientes").html(elHtml)
    $("#listaClientes2").html(elHtml)
}

//funcion para mostrar todos los productos en el front
function mostrarTodosProductos(productos){
    let elHtml = templateProductos({productos:productos})
    $("#listaProductos").html(elHtml)
}

function mostrarTodosProdPedidos(pedido){
    let elHtml = templatePedidos({pedido:pedido[0]})
    let total = templatetotal({total:pedido[1]})
    let date = templateDate({date:pedido[2]})
    let estado = templateEstado({estado:pedido[3]})
    let refresh = templateRefresh2()
    $('#tablaPedidos tbody').html(elHtml)
    $('#totalPedido').html(total)
    $('#datePedido').html(date)
    $('#estadoPedido').html(estado)
    $('#errorStock').html(refresh)
}

function mostrarError(error){
    let stockerror = templateError({error:error[0]})
    $('#errorStock').html(stockerror)
}

function hacerConfirmacion(confirm){
    let confirmation = templateConfirm({confirm:confirm[0]})
    $('#errorStock').html(confirmation)
}

function mostrarErrorFin(errorFin){
    let errorF = templateErrorFin({errorFin:errorFin[0]})
    $('#errorStock').html(errorF)
}

function mostrarMsgPedidoFin(pedidoFin){
    let pedidoFinaliado = templateConfirmFin({pedidoFin:pedidoFin[0]})
    let refresh = templateRefresh2()
    let refreshTable = templateRefresh1()
    $('#errorStock').html(pedidoFinaliado)
    $('#totalPedido').html(refresh)
    $('#datePedido').html(refresh)
    $('#estadoPedido').html(refresh)
    $('#tablaPedidos tbody').html(refreshTable)

}


// Recibo todos los clientes del back
socket.on('todos-los-clientes', function(data) {
    mostrarTodosClientes(data)
});

//recibo todos los productos en el back
socket.on('todos-los-productos', function(data) {
    mostrarTodosProductos(data)
});

socket.on('mostrar-prod-pedidos', function(data) {
    mostrarTodosProdPedidos(data)
});

//error message
socket.on('falta-stock', function(data){
    console.log('llegue a falta de stock', data)
    mostrarError(data)
})

socket.on('confirmation', function(data){
    console.log('llegue a confirmation', data)
    hacerConfirmacion(data)
})

socket.on('error-fin-pedido', function(data){
    console.log('llegue a error-fin-pedido', data)
    mostrarErrorFin(data)
})

socket.on('pedido-finalizado', function(data){
    console.log('llegue a pedido-finalizado', data)
    mostrarMsgPedidoFin(data)
})