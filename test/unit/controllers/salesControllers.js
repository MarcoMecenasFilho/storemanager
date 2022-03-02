const sinon = require('sinon');
const { expect } = require('chai');
const salesServices = require('../../../services/salesServices');
const salesControllers = require('../../../controllers/salesControllers');

describe('CONTROLLERS TESTS SALES', () => {
  const request = {};
  const response = {};
  let next = () => {};

  beforeEach(() => {
    request.body = {}
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns()
    next = sinon.stub().returns();
  })

  describe('checa vendas no  banco de dados', () => {
    const serviceResponse =  {
      code: 200,
      data: [
        {
          saleId: 1,
          date: '2022-02-24T15:40:47.000Z',
          productId: 1,
          quantity: 5
        },
        {
          saleId: 1,
          date: '2022-02-24T15:40:47.000Z',
          productId: 2,
          quantity: 10
        },
        {
          saleId: 2,
          date: '2022-02-24T15:40:47.000Z',
          productId: 3,
          quantity: 15
        }
      ]
    }
      beforeEach(() => {
        sinon.stub(salesServices, 'getAll').resolves(serviceResponse);
      });

      afterEach(() => {
        salesServices.getAll.restore();
      });


      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await salesControllers.getAll(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
        await salesControllers.getAll(request, response, next)

        expect(response.json.calledWith(serviceResponse.data)).to.be.true;
      })
    })

    describe('Procurar produto por Id que existe no BD', () => {
      const serviceResponse =  {
        code: 200,
        data: [ { date: '2022-02-24T15:40:47.000Z', 
        productId: 3, 
        quantity: 15 } ]
      }
        beforeEach(() => {
          request.params = {id: 1}
          sinon.stub(salesServices, 'getById').resolves(serviceResponse);
        });
  
        afterEach(() => {
          salesServices.getById.restore();
        });
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await salesControllers.getById(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
  
        it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
          await salesControllers.getById(request, response, next)
  
          expect(response.json.calledWith(serviceResponse.data)).to.be.true;
        })
    })

    describe('Procurar produto por Id que não existe no BD', () => {
      const serviceResponse =  { code: 404, message: 'Sale not found' }
      
        beforeEach(() => {
          request.params = {id: 60}
          sinon.stub(salesServices, 'getById').resolves(serviceResponse);
        });
  
        afterEach(() => {
          salesServices.getById.restore();
        });
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await salesControllers.getById(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
  
        it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
          await salesControllers.getById(request, response, next)
  
          expect(response.json.calledWith({message: serviceResponse.message})).to.be.true;
        })
    })
    describe('Cria uma venda no banco', () => {
      describe('Cadastrado com sucesso', () => {
      const serviceResponse =  { code: 201,  data: { id: 1, itemsSold: [{productId: 1, quantity: 300 }]}}
      beforeEach(() => {
        request.params = [{ "productId": 1, "quantity": 3 }];
        sinon.stub(salesServices, 'create').resolves(serviceResponse);
      })

        afterEach(() => {
          salesServices.create.restore()
        })

        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await salesControllers.create(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
  
        it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
          await salesControllers.create(request, response, next)
  
          expect(response.json.calledWith(serviceResponse.data)).to.be.true;
        })
      })
      describe('Cadastrar a venda, e a quantidade produto não é suficiente', () => {
        const serviceResponse =  { code: 422,  message: 'Such amount is not permitted to sell'}
        beforeEach(() => {
          request.params = [{ "productId": 1, "quantity": 300 }];
          sinon.stub(salesServices, 'create').resolves(serviceResponse);
        })
  
          afterEach(() => {
            salesServices.create.restore()
          })
  
          it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
            await salesControllers.create(request, response, next)
    
            expect(response.status.calledWith(serviceResponse.code)).to.be.true;
          })
    
          it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
            await salesControllers.create(request, response, next)
    
            expect(response.json.calledWith({message: serviceResponse.message})).to.be.true;
          })
        })
      describe('Quando a validação falha', () => { 
          it('Quando "productId" não é passado', async () => {
            request.body =[ {quantity: 500}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('400')).to.be.true;
            expect(response.json.calledWith( {message: '"productId" is required'})).to.be.true;
          })
          it('Quando "productId" não é um numero', async () => {
            request.body =[ {productId: '500', quantity: 20}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('422')).to.be.true;
            expect(response.json.calledWith( {message: '"productId" must be a number'})).to.be.true;
          })
          it('Quando "productId" não é um numero inteiro', async () => {
            request.body =[ {productId: 5.23, quantity: 20}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('422')).to.be.true;
            expect(response.json.calledWith( {message: '"productId" must an integer'})).to.be.true;
          })
          it('Quando "productId" não é um numero maior que 0', async () => {
            request.body =[ {productId: -2, quantity: 20}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('422')).to.be.true;
            expect(response.json.calledWith( {message: '"productId" must be greater than or equal to 1'})).to.be.true;
          })
          it('Quando "quantity" não é passado', async () => {
            request.body =[ {productId: 2}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('400')).to.be.true;
            expect(response.json.calledWith( {message: '"quantity" is required'})).to.be.true;
          })
          it('Quando "quantity" não é um numero', async () => {
            request.body =[ {productId: 2, quantity:"22"}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('422')).to.be.true;
            expect(response.json.calledWith( {message: '"quantity" must be a number'})).to.be.true;
          })
          it('Quando "quantity" não é um numero inteiro', async () => {
            request.body =[ {productId: 2, quantity:22.22}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('422')).to.be.true;
            expect(response.json.calledWith( {message: '"quantity" must an integer'})).to.be.true;
          })
          it('Quando "quantity" não é um numero maior que 0', async () => {
            request.body =[ {productId: 2, quantity: -2}]
            await salesControllers.create(request, response, next)
            expect(response.status.calledWith('422')).to.be.true;
            expect(response.json.calledWith( {message: '"quantity" must be greater than or equal to 1'})).to.be.true;
          })
      })
    })

  describe('Quando atualiza uma venda' , () => {
    describe('Realizado com sucesso', () => {
    const serviceResponse =  { code: 200,  data: { id: 1, itemsUpdated: [{productId: 1, quantity: 22 }]}}
    beforeEach(() => {
      request.params = {id: 1}
      request.body = [{productId:1 , quantity: 22}]
      sinon.stub(salesServices, 'update').resolves(serviceResponse);
    })

    afterEach(() => {
      salesServices.update.restore();
    });

      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await salesControllers.update(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
        await salesControllers.update(request, response, next)

        expect(response.json.calledWith(serviceResponse.data)).to.be.true;
      })
  })
  describe('Quando a venda não existe', () => {
    const serviceResponse =  { code: 404,  message: 'Sale not found'}
    beforeEach(() => {
      request.params = {id: 1}
      request.body = [{productId:1 , quantity: 22}]
      sinon.stub(salesServices, 'update').resolves(serviceResponse);
    })

    afterEach(() => {
      salesServices.update.restore();
    });

      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await salesControllers.update(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
        await salesControllers.update(request, response, next)

        expect(response.json.calledWith({message: serviceResponse.message})).to.be.true;
      })
  })
  describe('Quando o produto não existe na venda', () => {
    const serviceResponse =  { code: 404,  message: 'Product not found'}
    beforeEach(() => {
      request.params = {id: 1}
      request.body = [{productId:1 , quantity: 22}]
      sinon.stub(salesServices, 'update').resolves(serviceResponse);
    })

    afterEach(() => {
      salesServices.update.restore();
    });

      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await salesControllers.update(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
        await salesControllers.update(request, response, next)

        expect(response.json.calledWith({message: serviceResponse.message})).to.be.true;
      })
  })
  describe('Quando a validação falha', () => { 
    it('Quando "productId" não é passado', async () => {
      request.body =[ {quantity: 500}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('400')).to.be.true;
      expect(response.json.calledWith( {message: '"productId" is required'})).to.be.true;
    })
    it('Quando "productId" não é um numero', async () => {
      request.body =[ {productId: '500', quantity: 20}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"productId" must be a number'})).to.be.true;
    })
    it('Quando "productId" não é um numero inteiro', async () => {
      request.body =[ {productId: 5.23, quantity: 20}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"productId" must an integer'})).to.be.true;
    })
    it('Quando "productId" não é um numero maior que 0', async () => {
      request.body =[ {productId: -2, quantity: 20}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"productId" must be greater than or equal to 1'})).to.be.true;
    })
    it('Quando "quantity" não é passado', async () => {
      request.body =[ {productId: 2}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('400')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" is required'})).to.be.true;
    })
    it('Quando "quantity" não é um numero', async () => {
      request.body =[ {productId: 2, quantity:"22"}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" must be a number'})).to.be.true;
    })
    it('Quando "quantity" não é um numero inteiro', async () => {
      request.body =[ {productId: 2, quantity:22.22}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" must an integer'})).to.be.true;
    })
    it('Quando "quantity" não é um numero maior que 0', async () => {
      request.body =[ {productId: 2, quantity: -2}]
      await salesControllers.update(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" must be greater than or equal to 1'})).to.be.true;
    })
  })
  })

  describe('Quando deleta Uma venda', () => {
    describe('Quando a venda  existe no banco', () => {
      const serviceResponse = { code: 204 }
  
        beforeEach(() => {
          request.params = { id: 1}
          sinon.stub(salesServices, 'exclude').resolves(serviceResponse);
        });
        afterEach(() => {
          salesServices.exclude.restore();
        });
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await salesControllers.exclude(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
  
        it('Chama o response.json com {} ', async () =>{
          await salesControllers.exclude(request, response, next)
  
          expect(response.json.calledWith( {})).to.be.true;
        })
    })
    describe('Quando a venda não existe no banco', () => {
      const serviceResponse = {  code: 404, message: 'Sale not found' }
  
      beforeEach(() => {
        request.params = {id: 22} 
        sinon.stub(salesServices, 'exclude').resolves(serviceResponse);
      });
  
      afterEach(() => {
        salesServices.exclude.restore();
      });
  
      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await salesControllers.exclude(request, response, next)
  
        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })
  
      it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
        await salesControllers.exclude(request, response, next)
  
        expect(response.json.calledWith( {message: serviceResponse.message})).to.be.true;
      })

    })
  })
})
