module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      productName: {
        type: Sequelize.STRING
      },
      productPrice: {
        type: Sequelize.FLOAT
      },
      productAvailable: {
        type: Sequelize.BOOLEAN            
      },
    });
    return Product;
  };