const SqLOption = {
    client:'sqlite3',
    connection: {
      filename: "./models/db/cafeteriaPedidos.sqlite"
    },
    useNullAsDefault: true
}
  
module.exports = SqLOption;
