const productsService = require('../services/productsServices');
const AuthProducts = require('../middlewares/AuthProducts');

const getAll = async (_req, res, _next) => {
    const { code, data } = await productsService.getAll();
    return res.status(code).json(data);
};

const getById = async (req, res, __next) => {
  const { id } = req.params;

    const { code, message, data } = await productsService.getById(id);
    if (!data) {
      return res.status(code).json({ message });
    }
    return res.status(code).json(data);
};

const create = async (req, res, _next) => {
  const { name, quantity } = req.body;
  const { error } = AuthProducts.create.validate(req.body);
  
  if (error) {
    const [code, message] = error.message.split('|');
    return res.status(code).json({ message });
  }
  
  const { code, message, data } = await productsService.create(name, quantity);

  if (!data) {
    return res.status(code).json({ message });
  }
  return res.status(code).json({ id: data.id, name: data.name, quantity: data.quantity });
};

const update = async (req, res, _next) => {
  const { name, quantity } = req.body;
  const { id } = req.params;
  const { error } = AuthProducts.create.validate(req.body);
  
  if (error) {
    const [code, message] = error.message.split('|');
    return res.status(code).json({ message });
  }

  const { code, data, message } = await productsService.update(id, name, quantity);
  if (!data) {
    return res.status(code).json({ message });
  }
  return res.status(code).json({ id: data.id, name: data.name, quantity: data.quantity });
};

const exclude = async (req, res, _next) => {
  const { id } = req.params;
  const { code, message } = await productsService.exclude(id);
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