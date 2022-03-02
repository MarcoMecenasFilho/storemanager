const sinon = require('sinon');
const { expect } = require('chai');
const productsModels = require('../../../models/productsModels')
const productsServices = require('../../../services/productsServices');


describe('Service TESTS PRODUCTS', () => {
  describe('Checa lista de produtos', () => {
    describe('checa produtos no  banco de dados', () => {
      const modelResponse = [
        { id: 1, name: 'Martelo de Thor', quantity: 10 },
        { id: 2, name: 'Traje de encolhimento', quantity: 20 },
        { id: 3, name: 'Escudo do Capitão América', quantity: 30 }
      ];
      const servicesSuccessResponse = {
        code: 200,
        data: [
          { id: 1, name: 'Martelo de Thor', quantity: 10 },
          { id: 2, name: 'Traje de encolhimento', quantity: 20 },
          { id: 3, name: 'Escudo do Capitão América', quantity: 30 }
        ]
      }
    
        beforeEach(() => {
          sinon.stub(productsModels, 'getAll').resolves(modelResponse);
        })
  
        afterEach(() => {
        productsModels.getAll.restore();
        });
    
        it('Retorna um objeto', async () => {
          const result = await productsServices.getAll();
    
          expect(result).to.be.an('object')
        })
        it('Retorna um objeto com code e data', async () => {
          const result = await productsServices.getAll();
    
          expect(result).to.be.deep.equal(servicesSuccessResponse)
        })
      })
        
  
    describe('Procurar produto por Id que existe no BD', () => {
  
      const modelResponse = [
        { id: 1, name: 'Martelo de Thor', quantity: 10 },
      ];
      const servicesSuccessResponse = {
        code: 200,
        data:
          { id: 1, name: 'Martelo de Thor', quantity: 10 },
      }
      
    beforeEach(() => {
      sinon.stub(productsModels, 'getById').resolves(modelResponse);
    })
  
    afterEach(() => {
    productsModels.getById.restore();
    });
  
    it('Retorna um objeto', async () => {
      const result = await productsServices.getById();
  
      expect(result).to.be.an('object')
    })
    it('Retorna um objeto com code e data', async () => {
      const result = await productsServices.getById();
  
      expect(result).to.be.deep.equal(servicesSuccessResponse)
    })
      
    })
  
    describe('Procurar produto por Id que não existe no BD', () => {
  
      const modelResponse = [];
      const servicesSuccessResponse = {
        code: 404,
        message: 'Product not found',
      }
      
    beforeEach(() => {
      sinon.stub(productsModels, 'getById').resolves(modelResponse);
    })
  
    afterEach(() => {
    productsModels.getById.restore();
    });
  
    it('Retorna um objeto', async () => {
      const result = await productsServices.getById();
  
      expect(result).to.be.an('object')
    })
    it('Retorna um objeto com code e message', async () => {
      const result = await productsServices.getById();
  
      expect(result).to.be.deep.equal(servicesSuccessResponse)
    })
  });
  })

  describe('Adiciona produtos no BD', () => {
    const productData = {
      name: 'tijolo',
      quantity: 555
    }
    describe('Quando o produto não existe no banco',() => {
      // const executeResponseSuccess = [{affectedRows: 1}];
      const modelResponseSuccess = {
        id: 1,
        name: 'tijolo',
        quantity: 555
      };
      const getAllResponse = [{id: 2, name: 'bloco', quantity: 100}]

      const servicesSuccessResponse = {
        code: 201,
        data: modelResponseSuccess
      }

      beforeEach(() => {
        sinon.stub(productsModels, 'getAll').resolves(getAllResponse);
        sinon.stub(productsModels, 'create').resolves(modelResponseSuccess)
      })

      afterEach(() => {
        productsModels.getAll.restore();
        productsModels.create.restore();
      })

      it('Retorna o objeto com o id do produto', async () => {
        const modelResponse = await productsServices.create(productData.name, productData.quantity)
        expect(modelResponse).to.be.deep.equal(servicesSuccessResponse);
      })
    })
    describe('Quando o produto existe no banco', () => {

      const modelResponseSuccess = {
        id: 1,
        name: 'tijolo',
        quantity: 555
      };
      const getAllResponse = [
        {
        id: 1,
        name: 'tijolo',
        quantity: 555}
      ]

      const servicesResponseFail = {
        code: 409, 
        message: 'Product already exists' 
      }

      beforeEach(() => {
        sinon.stub(productsModels, 'getAll').resolves(getAllResponse);
        sinon.stub(productsModels, 'create').resolves(modelResponseSuccess)
      })

      afterEach(() => {
        productsModels.getAll.restore();
        productsModels.create.restore();
      })

      it('Retorna o objeto com um code e message do produto', async () => {
        const modelResponse = await productsServices.create(productData.name, productData.quantity)
        expect(modelResponse).to.be.deep.equal(servicesResponseFail);
      })
      
    })
  })
  describe('Atualiza produto no banco de dados', () => {
    const productData = {
      id: 1,
      name: 'tijolo',
      quantity: 555
    }
    describe('Quando o produto não existe no bando de dados', () => {

      const modelResponseSuccess = {
        id: 1,
        name: 'tijolo',
        quantity: 555
      };

      const servicesSuccessResponse = {
        code: 200,
        data: modelResponseSuccess
      }

      beforeEach(() => {
        sinon.stub(productsModels, 'update').resolves(modelResponseSuccess)
      })

      afterEach(() => {
        productsModels.update.restore();
      })

      it('Retorna o objeto com o id do produto', async () => {
        const modelResponse = await productsServices.update(productData.id, productData.name, productData.quantity)
        expect(modelResponse).to.be.deep.equal(servicesSuccessResponse);
      })

    })
    describe('Quando o produto existe no banco', () => {

      const modelResponseSuccess = {message: 'Product not found' };
      const servicesResponseFail = {
      code: 404, 
      message: 'Product not found'  
    }

      beforeEach(() => {
        sinon.stub(productsModels, 'update').resolves(modelResponseSuccess)
      })

      afterEach(() => {
        productsModels.update.restore();
      })

      it('Retorna o objeto com um code e message do produto', async () => {
        const modelResponse = await productsServices.update(productData.id, productData.name, productData.quantity)
        expect(modelResponse).to.be.deep.equal(servicesResponseFail);
      })
      
    })
  })
  describe('Deletar produto do banco', () => {
    const productData = {
      id: 1,
      name: 'tijolo',
      quantity: 555
    }
    describe('Quando o produto não existe no banco', () => {
      const modelResponseSuccess = {};

      const servicesSuccessResponse = {
        code: 204 
      }

      beforeEach(() => {
        sinon.stub(productsModels, 'exclude').resolves(modelResponseSuccess)
      })

      afterEach(() => {
        productsModels.exclude.restore();
      })

      it('Retorna o código status 204', async () => {
        const modelResponse = await productsServices.exclude(productData.id)
        expect(modelResponse).to.be.deep.equal(servicesSuccessResponse);
      })

    })
    describe('Quando o produto existe no banco', () => {

      const modelResponseSuccess = {message: 'Product not found' };
      const servicesResponseFail = {
      code: 404, 
      message: 'Product not found'  
    }

      beforeEach(() => {
        sinon.stub(productsModels, 'exclude').resolves(modelResponseSuccess)
      })

      afterEach(() => {
        productsModels.exclude.restore();
      })

      it('Retorna o objeto com um code e message do produto', async () => {
        const modelResponse = await productsServices.exclude(productData.id)
        expect(modelResponse).to.be.deep.equal(servicesResponseFail);
      })
      
    })
  })
});