const app = require('./app')
require("dotenv").config();

// const debug = require('debug')('app:startup')

require("./db/database");

PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`App now listening @ PORT ${PORT}`)
})