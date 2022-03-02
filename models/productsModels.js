const connection = require('./connection');

const getAll = async () => {
  const SQL = 'SELECT * FROM StoreManager.products ORDER BY id;';
  const [result] = await connection.execute(SQL);
  return result;
};

const getById = async (id) => {
  const SQL = 'SELECT * FROM StoreManager.products WHERE id = ?;';
  const [result] = await connection.execute(SQL, [id]);
  return result;
};

const create = async (name, quantity) => {
    const SQL = 'INSERT INTO StoreManager.products (name, quantity) VALUES (?, ?)';
    const [result] = await connection.execute(SQL, [name, quantity]);
    return {
      id: result.insertId,
      name,
      quantity,
    };
};

const update = async (id, name, quantity) => {
const SQL = `UPDATE StoreManager.products
SET name = ?, quantity = ?
WHERE id = ?;`;

const [result] = await connection.execute(SQL, [name, quantity, id]);
if (result.affectedRows === 0) {
  return { message: 'Product not found' };
}
return { id, name, quantity };
};

const updateProductDelete = async (productId, quantity) => {
  const SQL = `UPDATE StoreManager.products
  SET quantity = quantity + ?
  WHERE id = ?;`;

  const [result] = await connection.execute(SQL, [quantity, productId]);
  return { affectedRows: result.affectedRows };
};

const updateProductSale = async (productId, quantity) => {
  const SQL = `UPDATE StoreManager.products 
              SET quantity = CASE WHEN (quantity - ? >= 0) THEN (quantity - ?)
              ELSE quantity END
              WHERE id = ?;`;
    const [result] = await connection.execute(SQL, [quantity, quantity, productId]);
    const { affectedRows } = result;
    console.log(result.info);
    console.log(result);
    const changed = result.info.split(' ')[5];
    return { productId, affectedRows, changed: Number(changed), quantity };
};

const exclude = async (id) => {
  const SQL = 'DELETE FROM StoreManager.products WHERE id = ?;';
  
  const [result] = await connection.execute(SQL, [id]);
  if (result.affectedRows === 0) {
    return { message: 'Product not found' };
  }
  return {};
  };

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateProductDelete,
  updateProductSale,
  exclude,
};