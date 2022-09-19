const moment = require('moment')
const clientesModel = require('../models/db/cliente')
const productosController = require('./productos')

const Productos = new productosController()


module.exports = class ClientesDB {
  constructor() {
    
  }

  async listarClientes(){
    let listadoClientes = await clientesModel.find()
    return listadoClientes
  }

  async buscarCliente(id){
    let listadoClientes = await clientesModel.find() //hago un select de todos los clientes
    let indice = listadoClientes.findIndex(f => f.id == id);
    if(indice != -1){
        return listadoClientes[indice]
    }
  }

  async crearCliente ({nombre, apellido, dni, email}){
    let listadoClientes = await clientesModel.find() //hago un select de todos los clientes
    let cantidad = (await listadoClientes).length + 1 //defino el ID para el nuevo cliente
    let clienteNuevo = {
      id: cantidad,
      nombre,
      apellido,
      dni,
      email
    }
    await clientesModel.create(clienteNuevo)
    
  }

  async agregarProducto({clienteID, productoID, cantidadProd}){
    let elCliente = await this.buscarCliente(clienteID)
    let clienteinternal_id = elCliente._id.toString()
    let elProducto = await Productos.buscarProducto(productoID)
    let prodinternal_id = elProducto._id.toString()
    let productosCliente = elCliente.productos

    if(cantidadProd > elProducto.stock){
      return 'stockError'
    }

    if (cantidadProd === 0){
      return 'stockError'
    }

    let indiceProductoCliente = productosCliente.findIndex(f => f.id == productoID)

    if(indiceProductoCliente == -1){ //significa que el producto a insertar no estaba en el pedido del user
      elProducto.cantidad = cantidadProd
      elCliente.productos.push(elProducto)
      await clientesModel.findByIdAndUpdate(clienteinternal_id,elCliente,{new:false})
      await Productos.actualizarStock(productoID, cantidadProd)
    }else{
      productosCliente[indiceProductoCliente].cantidad = productosCliente[indiceProductoCliente].cantidad + parseInt(cantidadProd)
      await clientesModel.findByIdAndUpdate(clienteinternal_id,elCliente,{new:true})
  
      await Productos.actualizarStock(productoID, cantidadProd)
    }

  }

  async borrarClientes(id){
    if(id !== ''){
      let elCliente = await this.buscarCliente(id)
      let internal_id = elCliente._id.toString()
      await clientesModel.findByIdAndDelete(internal_id)
    }
  }

}