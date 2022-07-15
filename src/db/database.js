// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "",
//     DB: "scelloo_task",
//     dialect: "mysql",
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   };

//heroku config
module.exports = {
  HOST: "us-cdbr-east-06.cleardb.net",
  USER: "b0746e53ac8ce9",
  PASSWORD: "660d9211",
  DB: "heroku_7167f9aaa257fa5",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};