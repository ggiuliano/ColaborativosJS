const { Schema, model } = require('mongoose')

const productosSchema = new Schema({
    id:Number,
    nombre:String,
    precio:Number,
    stock:Number,
    cantidad:Number
})

module.exports = model('productos', productosSchema);