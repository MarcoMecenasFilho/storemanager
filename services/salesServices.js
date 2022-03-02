const salesModels = require('../models/salesModels');
const productsModels = require('../models/productsModels');

const getAll = async () => {
  const modelResponse = await salesModels.getAll();
  console.log({ code: 200, data: modelResponse });
  return { code: 200, data: modelResponse };
}; 

const getById = async (id) => {
  const modelResponse = await salesModels.getById(id);
  if (!modelResponse[0] || modelResponse[0] === {}) {
    return { code: 404, message: 'Sale not found' };
  }
  return { code: 200, data: modelResponse };
};

// eslint-disable-next-line max-lines-per-function
const create = async (sales) => {
  const productsSales = await Promise.all(sales.map(async (elem) => productsModels
    .updateProductSale(elem.productId, elem.quantity)));

    const filteredByProductsNotExist = productsSales.filter((elem) => elem.affectedRows === 0);
    if (filteredByProductsNotExist[0]) { 
      return { code: 404,
message: `Product not found. ProductId:${filteredByProductsNotExist
        .map((elem) => ` ${elem.productId}`)}` }; 
}
  
    const filteredProductsOk = productsSales.filter((elem) => elem.changed !== 0);
    const filteredProductsFail = productsSales.filter((elem) => elem.changed === 0);
  
    const filteredProductsOkMap = filteredProductsOk
    .map((elem) => ({ productId: elem.productId, quantity: elem.quantity }));
  
    if (filteredProductsFail[0]) {
      return { code: 422,
message: `Such amount is not permitted to sell. ProductId: ${filteredProductsFail
        .map((elem) => `${elem.productId}`)}` };
    }
  
    if (filteredProductsOk) {
      const { insertId } = await salesModels.createSale();
      await Promise.all(filteredProductsOk.map(async (element) => {
      await salesModels.createProductSale(insertId, element.productId, element.quantity);
    }));
    return { code: 201, data: { id: insertId, itemsSold: filteredProductsOkMap } };
    } 
};

const addProducts = async (id, productId, { quantity, restOfUpdate }) => {
  await productsModels.updateProductDelete(productId, restOfUpdate);
  await salesModels.update(id, productId, quantity);
  return { code: 200, data: { saleId: id, itemUpdated: [{ productId, quantity }] } };
};

const removeProducts = async (id, productId, { quantity, checkDiferenceInProducts }) => {
const { changed } = await (productsModels
  .updateProductSale(productId, checkDiferenceInProducts));
  
  if (changed === 0) {
    return { code: 422, message: 'Such amount is not permitted to sell' };
  }
  if (changed !== 0) {
    await salesModels.update(id, productId, quantity);
    return { code: 200, data: { saleId: id, itemUpdated: [{ productId, quantity }] } };
}
};

const update = async (id, productId, quantity) => {
  const sale = await salesModels.getById(id);
  if (!sale[0]) { return { code: 404, message: 'Sale not found' }; }
  const filteredByProductId = sale.filter((elem) => elem.productId === productId);
  
  if (!filteredByProductId[0]) {
    return { code: 404, message: 'Product not found' };
  }
  const checkDiferenceInProductsSales = quantity - filteredByProductId[0].quantity;
  const restOfUpdate = (checkDiferenceInProductsSales * (-1));
  
  if (checkDiferenceInProductsSales < 0) {
    return addProducts(id, productId, { quantity, restOfUpdate });
  }
  
  if (checkDiferenceInProductsSales > 0) {
    return removeProducts(id, productId,
      { quantity, checkDiferenceInProducts: checkDiferenceInProductsSales });
  }
};
  
const exclude = async (id) => {
  const productsRestore = await salesModels.getById(id);

  await Promise.all(productsRestore
  .map(async (elem) => {
  await productsModels
    .updateProductDelete(elem.productId, elem.quantity); 
}));

  const modelResponse = await salesModels.exclude(id);
  if (modelResponse.message) {
    return { code: 404, message: modelResponse.message };
  }
  return { code: 204 };
};

module.exports = {
  getAll,
  getById,
  create,
  addProducts,
  removeProducts,
  update,
  exclude,
};