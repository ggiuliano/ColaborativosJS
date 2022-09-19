require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8080,
    MONGO_URI:process.env.MONGO_URI
}