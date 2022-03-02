const connection = require('./connection');

const transformCamelCase = (array) => array.map((elem) => ({
    saleId: elem.sale_id,
    date: elem.date,
    productId: elem.product_id,
    quantity: elem.quantity }));

    const transformCamelCaseWithOutId = (array) => array.map((elem) => ({
      date: elem.date,
      productId: elem.product_id,
      quantity: elem.quantity }));

const getAll = async () => {
  const SQL = `
SELECT smsp.sale_id, sms.date, smsp.product_id , quantity
FROM  StoreManager.sales_products smsp
INNER JOIN  StoreManager.sales sms
ON sms.id = smsp.sale_id;`;
  const [result] = await connection.execute(SQL);
  return transformCamelCase(result);
};

const getById = async (id) => {
  const SQL = `
  SELECT sms.date, smsp.product_id , quantity
  FROM  StoreManager.sales_products smsp
  INNER JOIN  StoreManager.sales sms
  ON sms.id = smsp.sale_id
  WHERE sms.id = ?`;
  const [result] = await connection.execute(SQL, [id]);
  console.log(transformCamelCaseWithOutId(result));
  return transformCamelCaseWithOutId(result);
};

const createProductSale = async (saleId, productId, quantity) => {
  const SQL = `
  INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity)
  VALUES (?, ?, ?)`;
  const [result] = await connection.execute(SQL, [saleId, productId, quantity]);
  return { insertId: result.insertId };
  };
  
  const createSale = async () => {
    const SQL = 'INSERT INTO StoreManager.sales (`date`) VALUES (NOW())';
    const [result] = await connection.execute(SQL);
    return { insertId: result.insertId };
  };

  const update = async (id, productId, quantity) => {
    const SQL = `
    UPDATE StoreManager.sales_products
    SET quantity=?
    WHERE sale_id=? AND product_id=?`;
    const [result] = await connection.execute(SQL, [quantity, id, productId]);
    return { affectedRows: result.affectedRows };
  };

  const exclude = async (id) => {
    const SQL = 'DELETE FROM StoreManager.sales WHERE id = ?;';
  
    const [result] = await connection.execute(SQL, [id]);

    if (result.affectedRows === 0) {
      return { message: 'Sale not found' };
    }
    return {};
  };

module.exports = {
  getAll,
  getById,
  createSale,
  createProductSale,
  update,
  exclude,
};