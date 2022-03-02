const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const salesModels = require('../../../models/salesModels');

describe('MODEL TESTS SALES', () => {
  describe('checa vendas banco de dados vazio', () => {
    const productData = [[]];
  
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(productData);
      })

      afterEach(() => {
        connection.execute.restore();
      });
  
      it('Retorna um array', async () => {
        const result = await salesModels.getAll();
  
        expect(result).to.be.an('array')
      })

      it('retorna um array vazio', async () => {
        const result = await salesModels.getAll()
        expect(result).to.be.empty
      })
    })
      
    describe('Checa vendas com BD populado', () => {
      const saleData = [
          [ 
            {
              sale_id: 1,
              product_id: 1,
              quantity: 5,
              id: 1,
              date: '2022-02-24T15:40:47.000Z'
            },
            {
              sale_id: 1,
              product_id: 2,
              quantity: 10,
              id: 1,
              date: '2022-02-24T15:40:47.000Z'
            },
            {
              sale_id: 2,
              product_id: 3,
              quantity: 15,
              id: 2,
              date: '2022-02-24T15:40:47.000Z'
            },
          ]
      ];
    beforeEach(() => {
      sinon.stub(connection, 'execute').resolves(saleData);
    })

    afterEach(() => {
      connection.execute.restore();
    });

    it('Retorna um array', async () => {
      const result = await salesModels.getAll();

      expect(result).to.be.an('array')
    })

    it('retorna um array não vaio', async () => {
      const result = await salesModels.getAll()
      expect(result).not.to.be.empty
    })

    it('retorna um array com 3 items', async () => {
      const result = await salesModels.getAll()
      expect(result).to.have.length(3)
    });
  });

  describe('Procurar produto por Id', () => {
  
  const  saleData = [[
      {
        sale_id: 2,
        product_id: 3,
        quantity: 15,
        id: 2,
        date: '2022-02-24T15:40:47.000Z'
      }
    ]]

    beforeEach(() => {
      sinon.stub(connection, 'execute').resolves(saleData)
    })
    afterEach(() => {
      connection.execute.restore();
    });

    it('Retorna um objeto', async () => {
      const result = await salesModels.getById()
      expect(result[0]).to.be.an('object')
    })

    it('Retorna uma venda não vazio', async () => {
      const result = await salesModels.getById()
      expect(result).not.to.be.empty
    })
    
  })
  describe('Adiciona uma venda', () => {
    const saleData = {saleId: 1, productId: 1, quantity: 200}

    const executeResponse = [{insertId: 1}]

    const modelSuccessResponse = { insertId: 1};

    beforeEach(() => {
      sinon.stub(connection, 'execute').resolves(executeResponse);
    })

    afterEach(() => connection.execute.restore())

    it('Retorna um objeto com o id criado da venda na função  createProductSale', async () => {
      const modelResponse = await salesModels.createProductSale(saleData.saleId, saleData.productId ,saleData.quantity)

      expect(modelResponse).to.be.deep.equal(modelSuccessResponse);
    })
    it('Retorna um objeto com o id criado da venda na função  createSale', async () => {
      const modelResponse = await salesModels.createSale()

      expect(modelResponse).to.be.deep.equal(modelSuccessResponse);
    })

  })

  describe('Quando uma venda é atualizada', () => {
    const saleData = {
      id: 1,
      productId: 1,
      quantity: 300
    }
      const executeResponseSuccess = [{affectedRows: 1}];
      const modelResponseSuccess = { affectedRows: 1 }

      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseSuccess);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com as informações do id gerado', async () => {
        const modelResponse = await salesModels.update(saleData.id, saleData.productId, saleData.quantity)
        expect(modelResponse).to.be.deep.equal(modelResponseSuccess);
      })
  })
  describe('Quando uma venda é excluída', () => {
    const saleData = {
      id: 1,
    }
    describe('Quando a venda existe no banco', () => {
      const executeResponseSuccess = [{affectedRows: 1}];
      const modelResponseSuccess = {}
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseSuccess);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto vazio', async () => {
        const modelResponse = await salesModels.exclude(saleData.id)
        expect(modelResponse).to.be.deep.equal(modelResponseSuccess);
      })
    })
    describe('Quando o produto não existe no banco', () => {
      const executeResponseFail = [{affectedRows: 0}];
      const modelResponseFail = { message: 'Sale not found'}
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseFail);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com message "Sale not found"', async () => {
        const modelResponse = await salesModels.exclude(saleData.id)
        expect(modelResponse).to.be.deep.equal(modelResponseFail);
      })
    })
  })
});