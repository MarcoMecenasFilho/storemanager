const productsModels = require('../models/productsModels');

const getAll = async () => {
  const modelResponse = await productsModels.getAll();

  return { code: 200, data: modelResponse };
}; 

const getById = async (id) => {
  const [modelResponse] = await productsModels.getById(id);
  console.log(modelResponse);
  if (!modelResponse || modelResponse === {}) {
    return { code: 404, message: 'Product not found' };
  }

  return { code: 200, data: modelResponse };
};
 
const create = async (name, quantity) => {
  const allProducts = await productsModels.getAll();
  if (allProducts.some((elem) => elem.name === name)) {
    return { code: 409, message: 'Product already exists' };
  }
  
  const modelResponse = await productsModels.create(name, quantity);

  return { code: 201, data: modelResponse };
};

const update = async (id, name, quantity) => {
const modelResponse = await productsModels.update(id, name, quantity);
if (modelResponse.message) {
  return { code: 404, message: modelResponse.message };
}
return { code: 200, data: modelResponse };
};

const exclude = async (id) => {
  const modelResponse = await productsModels.exclude(id);
  if (modelResponse.message) {
    return { code: 404, message: modelResponse.message };
  }
  return { code: 204 };
  };

module.exports = {
  getAll,
  getById,
  create,
  update,
  exclude,
};