const { Schema, model } = require('mongoose')

const clienteSchema = new Schema({
    id:Number,
    nombre:String,
    apellido:String,
    dni:String,
    email:String,
    timestamp:String,
    productos:[{
        id:Number,
        nombre:String,
        precio:Number,
        cantidad:Number
    }], 
})

module.exports = model('clientes', clienteSchema);