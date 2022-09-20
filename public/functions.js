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

var templatetotal = Handlebars.compile(`
          <label style="font-weight:bold">Fecha: {{date}}</label>
`)

var templateError = Handlebars.compile(`
        <label>{{error}}</label>
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
    $('#tablaPedidos tbody').html(elHtml)
    $('#totalPedido').html(total)
    $('#datePedido').html(total)
}

function mostrarError(error){
    let elHtml = templateError(error)
    $('#errorStock').html(elHtml)
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
    mostrarError(data)
})