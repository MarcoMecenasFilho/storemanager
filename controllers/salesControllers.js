const salesServices = require('../services/salesServices');
const AuthSales = require('../middlewares/AuthSales');

const getAll = async (_req, res, _next) => {
    const { code, data } = await salesServices.getAll();
    return res.status(code).json(data);
};

const getById = async (req, res, _next) => {
  const { id } = req.params;
    const { code, message, data } = await salesServices.getById(id);
    if (message) {
      return res.status(code).json({ message });
    }
    return res.status(code).json(data);
};

const create = async (req, res, _next) => {
  const sales = req.body;
  const { error } = AuthSales.create.validate(sales[0]);
  
  if (error) {
    const [codes, message] = error.message.split('|');
    console.log(message);
    return res.status(codes).json({ message });
  }

  const { code, data, message } = await salesServices.create(req.body);
  if (message) {
    return res.status(code).json({ message });
  }

  return res.status(code).json(data);
};

const update = async (req, res, _next) => {
  const { id } = req.params;
  const sales = req.body;
  const { productId, quantity } = sales[0];
  const { error } = AuthSales.create.validate(sales[0]);
  
  if (error) {
    const [code, message] = error.message.split('|');
    return res.status(code).json({ message });
  }
  const { code, data, message } = await salesServices.update(id, productId, quantity);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

const exclude = async (req, res, __next) => {
  const { id } = req.params;
  const { code, message } = await salesServices.exclude(id);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json({});
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  exclude,
};