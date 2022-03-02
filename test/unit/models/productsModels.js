const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const productModels = require('../../../models/productsModels');

describe('MODEL TESTS PRODUCTS', () => {
  describe('Faz get dos products', () => {
    describe('checa produtos banco de dados vazio', () => {
      const productData = [[]];
    
        beforeEach(() => {
          sinon.stub(connection, 'execute').resolves(productData);
        })
  
        afterEach(() => {
          connection.execute.restore();
        });
    
        it('Retorna um array', async () => {
          const result = await productModels.getAll();
    
          expect(result).to.be.an('array')
        })
  
        it('retorna um array vazio', async () => {
          const result = await productModels.getAll()
          expect(result).to.be.empty
        })
      })
        
      describe('Checa produtos com BD populado', () => {
        const productData = [[
          {
              id: 1,
              name: "Martelo de Thor",
              quantity: 10
          },
          {
              id: 2,
              name: "Traje de encolhimento",
              quantity: 20
          },
          {
              id: 3,
              name: "Escudo do Capitão América",
              quantity: 30
          }
      ]];
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(productData);
      })
  
      afterEach(() => {
        connection.execute.restore();
      });
  
      it('Retorna um array', async () => {
        const result = await productModels.getAll();
  
        expect(result).to.be.an('array')
      })
  
      it('retorna um array não vaio', async () => {
        const result = await productModels.getAll()
        expect(result).not.to.be.empty
      })
  
      it('retorna um array com 3 items', async () => {
        const result = await productModels.getAll()
        expect(result).to.have.length(3)
      });
    });
  
    describe('Procurar produto por Id', () => {
  
      const productData = [
        {
          "id": 1,
          "name": "Martelo de Thor",
          "quantity": 10
      },
    ]
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(productData)
      })
      afterEach(() => {
        connection.execute.restore();
      });
  
      it('Retorna um objeto', async () => {
        const result = await productModels.getById()
        expect(result).to.be.an('object')
      })
  
      it('Retorna um produto não vazio', async () => {
        const result = await productModels.getById()
        expect(result).not.to.be.empty
      })
      
    })
  })

  describe('Adiciona um produto', () => {
      const productData = {name: 'tijolo', quantity: 300}

      const executeResponse = [{insertId: 1}]

      const modelSuccessResponse = {
        id: 1,
        name: 'tijolo',
        quantity: 300,
      };

      describe('Quando o produto é cadastrado com sucesso', () => {
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponse);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com as informações do produto e o ID', async () => {
        const modelResponse = await productModels.create(productData.name, productData.quantity)
  
        expect(modelResponse).to.be.deep.equal(modelSuccessResponse);
      })

    })
  })

  describe('Quando um produto é atualizado', () => {
    const productData = {
      id: 1,
      name: 'tijolo',
      quantity: 300
    }
    describe('Quando o produto existe no banco', () => {
      const executeResponseSuccess = [{affectedRows: 1}];
      const modelResponseSuccess = { id: 1, name: 'tijolo', quantity: 300 }
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseSuccess);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com as informações do produto e o ID', async () => {
        const modelResponse = await productModels.update(productData.id, productData.name, productData.quantity)
        expect(modelResponse).to.be.deep.equal(modelResponseSuccess);
      })


    })
    describe('Quando o produto não existe no banco', () => {
      const executeResponseFail = [{affectedRows: 0}];
      const modelResponseFail = { message: 'Product not found' };

      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseFail);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com uma message', async () => {
        const modelResponse = await productModels.update(productData.id, productData.name, productData.quantity)
        expect(modelResponse).to.be.deep.equal(modelResponseFail);
      })
    })
  })
  describe('Quando o produto é excluído', () => {
    const productData = {
      id: 1,
    }
    describe('Quando o produto existe no banco', () => {
      const executeResponseSuccess = [{affectedRows: 1}];
      const modelResponseSuccess = {}
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseSuccess);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto vazio', async () => {
        const modelResponse = await productModels.exclude(productData.id)
        expect(modelResponse).to.be.deep.equal(modelResponseSuccess);
      })
    })
    describe('Quando o produto não existe no banco', () => {
      const executeResponseFail = [{affectedRows: 0}];
      const modelResponseFail = { message: 'Product not found'}
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseFail);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com a message "Product not found"', async () => {
        const modelResponse = await productModels.exclude(productData.id)
        expect(modelResponse).to.be.deep.equal(modelResponseFail);
      })
    })
  })
  describe('checa se um produto foi atualizado quando a venda é excluída', () => {
    const productData = {
      productId: 1,
      quantity: 20
    }
    describe('Quando o produto existe no banco', () => {
      const executeResponseSuccess = [{affectedRows: 1}];
      const modelResponseSuccess = {affectedRows: 1}
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseSuccess);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com a linha afetada', async () => {
        const modelResponse = await productModels
        .updateProductDelete(productData.productId, productData.quantity)
        expect(modelResponse).to.be.deep.equal(modelResponseSuccess);
      })
    })
    describe('Quando o produto não existe no banco', () => {
      const executeResponseFail = [{affectedRows: 0}];
      const modelResponseFail = { affectedRows: 0}
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves(executeResponseFail);
      })

      afterEach(() => {connection.execute.restore()})

      it('Retorna um objeto com a linha afetada sendo 0"', async () => {
        const modelResponse = await productModels
        .updateProductDelete(productData.productId, productData.quantity)
        expect(modelResponse).to.be.deep.equal(modelResponseFail);
      })
    })
    describe('checa se um produto foi atualizado quando a venda é feita', () => {
      const productData = {
        productId: 1,
        quantity: 20
      }
      describe('Quando o produto existe no banco', () => {
        const executeResponseSuccess = [{affectedRows: 1, info:'Rows matched: 1  Changed: 1  Warnings: 0'}];
        const modelResponseSuccess = { productId: 1, affectedRows: 1, changed: 1, quantity: 20 }
        beforeEach(() => {
          sinon.stub(connection, 'execute').resolves(executeResponseSuccess);
        })
  
        afterEach(() => {connection.execute.restore()})
  
        it('Retorna um objeto com a linha afetada e se a mudança ocorreu', async () => {
          const modelResponse = await productModels
          .updateProductSale(productData.productId, productData.quantity)
          expect(modelResponse).to.be.deep.equal(modelResponseSuccess);
        })
      })
      describe('Quando o produto não existe no banco', () => {
        const executeResponseFail = [{affectedRows: 1, info:'Rows matched: 1  Changed: 0  Warnings: 0'}];
        const modelResponseFail = { productId: 1, affectedRows: 1, changed: 0, quantity: 20 }
        beforeEach(() => {
          sinon.stub(connection, 'execute').resolves(executeResponseFail);
        })
  
        afterEach(() => {connection.execute.restore()})
  
        it('Retorna um objeto com a linha afetada sendo 0"', async () => {
          const modelResponse = await productModels
          .updateProductSale(productData.productId, productData.quantity)
          expect(modelResponse).to.be.deep.equal(modelResponseFail);
        })
      })
    })
  })
});