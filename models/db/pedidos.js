const { Schema, model } = require('mongoose')

const pedidosSchema = new Schema({
    idCliente:Number,
    email:String,
    total:Number,
    fecha:String,
    pedido:[{
        id:Number,
        nombre:String,
        precio:Number,
        cantidad:Number
    }], 
})

module.exports = model('pedidos', pedidosSchema);