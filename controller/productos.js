const moment = require('moment')
const productosModel = require('../models/db/productos')

module.exports = class ProductoDB {
    constructor() {
      
    }
    
    async listarProductos(){
      let listadoProductos = await productosModel.find()
      return listadoProductos
    }
  
    async crearProducto ({nombre, precio, stock}){
      let listadoProductos = await productosModel.find() //hago un select de todos los productos
      let cantidad = (await listadoProductos).length + 1 //defino el ID para el nuevo productos
      let productoNuevo = {
        id: cantidad,
        nombre,
        precio,
        stock
      }
      await productosModel.create(productoNuevo)
      
    }

    async buscarProducto(id){
      let listadoProductos = await productosModel.find() //hago un select de todos los productos
      let indice = listadoProductos.findIndex(f => f.id == id);
      if(indice != -1){
          return listadoProductos[indice]
      }
    }

    async actualizarStock(idProd, cantidad){
      let elProducto = await this.buscarProducto(idProd)
      let internal_id = elProducto._id.toString()
      elProducto.stock = elProducto.stock - parseInt(cantidad)
      await productosModel.findByIdAndUpdate(internal_id, elProducto, {new:false})
    }

  }