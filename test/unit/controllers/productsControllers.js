const sinon = require('sinon');
const { expect } = require('chai');
const productsServices = require('../../../services/productsServices');
const productsControllers = require('../../../controllers/productsControllers');

describe('CONTROLLERS TESTS PRODUCTS', () => {
  const request = {};
  const response = {};
  let next = () => {};
  
  beforeEach(() => {
    request.body = {}
    request.params = {}
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns()
    next = sinon.stub().returns();;
  })

  describe('checa produtos no  banco de dados', () => {
    const serviceResponse =  {
      code: 200,
      data: [
        { id: 1, name: 'Martelo de Thor', quantity: 10 },
        { id: 2, name: 'Traje de encolhimento', quantity: 20 },
        { id: 3, name: 'Escudo do Capitão América', quantity: 30 }
      ]
    }
      beforeEach(() => {
        sinon.stub(productsServices, 'getAll').resolves(serviceResponse);
      });

      afterEach(() => {
        productsServices.getAll.restore();
      });


      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await productsControllers.getAll(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
        await productsControllers.getAll(request, response, next)

        expect(response.json.calledWith(serviceResponse.data)).to.be.true;
      })
    })

    describe('Procurar produto por Id que existe no BD', () => {
      const serviceResponse =  {
        code: 200,
        data: 
          { id: 1, name: 'Martelo de Thor', quantity: 10 },
      }
        beforeEach(() => {
          request.params = {id: 1}
          sinon.stub(productsServices, 'getById').resolves(serviceResponse);
        });
  
        afterEach(() => {
          productsServices.getById.restore();
        });
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await productsControllers.getById(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
        it('Chama o response.status com o valor 200 da propriedade "code" do serviceResponse', async () =>{
          await productsControllers.getById(request, response, next)
  
          expect(response.status.calledWith(200)).to.be.true;
        })
  
        it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
          await productsControllers.getById(request, response, next)
  
          expect(response.json.calledWith(serviceResponse.data)).to.be.true;
        })
    })

    describe('Procurar produto por Id que não existe no BD', () => {
      const serviceResponse =  { code: 404, message: 'Product not found' }
      
        beforeEach(() => {
          request.params = {id: 60}
          sinon.stub(productsServices, 'getById').resolves(serviceResponse);
        });
  
        afterEach(() => {
          productsServices.getById.restore();
        });
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await productsControllers.getById(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
  
        it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
          await productsControllers.getById(request, response, next)
  
          expect(response.json.calledWith({message: serviceResponse.message})).to.be.true;
        })
    })


  describe('Adicionar um produto', () => { 
    describe('Quando o produto não existe no  banco de dados',  () => {

      const serviceResponse = { 
        code: 201, 
        data: {
        id: 1,
        name: 'azulejo',
        quantity: 333
      } }

      beforeEach(() => {
        request.body = { name: 'azulejo', quantity: 333}
        sinon.stub(productsServices, 'create').resolves(serviceResponse);
      });

      afterEach(() => {
        productsServices.create.restore();
      });

      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await productsControllers.create(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
        await productsControllers.create(request, response, next)

        expect(response.json.calledWith( serviceResponse.data)).to.be.true;
      })
    })
  describe('Quando o produto já existe no banco', () => {
    const serviceResponse = { code: 409, message: 'Product already exists' }

    beforeEach(() => {
      request.body = { name: 'azulejo', quantity: 333}
      sinon.stub(productsServices, 'create').resolves(serviceResponse);
    });

    afterEach(() => {
      productsServices.create.restore();
    });

    it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
      await productsControllers.create(request, response, next)

      expect(response.status.calledWith(serviceResponse.code)).to.be.true;
    })

    it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
      await productsControllers.create(request, response, next)

      expect(response.json.calledWith( {message: serviceResponse.message})).to.be.true;
    })

  })
  describe('Quando a validação falha', () => { 
    it('Quando "name" não é passado', async () => {
      request.body = {quantity: 500}
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('400')).to.be.true;
      expect(response.json.calledWith( {message: '"name" is required'})).to.be.true;
    })
    it('Quando name não é uma string', async () => {
      request.body = {name:222, quantity: 500}
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"name" must be a string'})).to.be.true;
    })
    it('Quando "name" tem menos de 5 caracteres', async () => {
      request.body = {name: "jo", quantity: 500}
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message:'"name" length must be at least 5 characters long'})).to.be.true;
    })
    it('Quando "quantity" não é passado', async () => {
      request.body = {name: "jorginho"}
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('400')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" is required'})).to.be.true;
    })
    it('Quando "quantity" não é um numero', async () => {
      request.body = {name: "jorginho", quantity:"22"}
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" must be a number'})).to.be.true;
    })
    it('Quando "quantity" não é um numero inteiro', async () => {
      request.body = {name: "jorginho", quantity:22.22} 
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" must an integer'})).to.be.true;
    })
    it('Quando "quantity" não é um numero maior que 0', async () => {
      request.body = {name: "jorginho", quantity: -2}
      await productsControllers.create(request, response, next)
      expect(response.status.calledWith('422')).to.be.true;
      expect(response.json.calledWith( {message: '"quantity" must be greater than or equal to 1'})).to.be.true;
    })
    })
  })

  describe('Atualizar um produto no banco de dados', () => {
    describe('Quando o produto  existe no banco', () => {
      const serviceResponse = { 
        code: 200, 
        data: {
        id: 1,
        name: 'azulejo',
        quantity: 333
      } }

      beforeEach(() => {
        request.body = { name: 'azulejo', quantity: 333}
        sinon.stub(productsServices, 'update').resolves(serviceResponse);
      });

      afterEach(() => {
        productsServices.update.restore();
      });

      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await productsControllers.update(request, response, next)

        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })

      it('Chama o response.json com o valor da propriedade "data" do serviceResponse ', async () =>{
        await productsControllers.update(request, response, next)

        expect(response.json.calledWith( serviceResponse.data)).to.be.true;
      })
    })
    describe('Quando o produto não existe no banco', () => {
      const serviceResponse = {  code: 404, message: 'Product not found' }
  
      beforeEach(() => {
        request.body = { name: 'azulejo', quantity: 333}
        sinon.stub(productsServices, 'update').resolves(serviceResponse);
      });
  
      afterEach(() => {
        productsServices.update.restore();
      });
  
      it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
        await productsControllers.update(request, response, next)
  
        expect(response.status.calledWith(serviceResponse.code)).to.be.true;
      })
  
      it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
        await productsControllers.update(request, response, next)
  
        expect(response.json.calledWith( {message: serviceResponse.message})).to.be.true;
      })
      
      describe('Quando a validação falha', () => { 
        it('Quando "name" não é passado', async () => {
          request.body = {quantity: 500}
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('400')).to.be.true;
          expect(response.json.calledWith( {message: '"name" is required'})).to.be.true;
        })
        it('Quando name não é uma string', async () => {
          request.body = {name:222, quantity: 500}
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('422')).to.be.true;
          expect(response.json.calledWith( {message: '"name" must be a string'})).to.be.true;
        })
        it('Quando "name" tem menos de 5 caracteres', async () => {
          request.body = {name: "jo", quantity: 500}
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('422')).to.be.true;
          expect(response.json.calledWith( {message:'"name" length must be at least 5 characters long'})).to.be.true;
        })
        it('Quando "quantity" não é passado', async () => {
          request.body = {name: "jorginho"}
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('400')).to.be.true;
          expect(response.json.calledWith( {message: '"quantity" is required'})).to.be.true;
        })
        it('Quando "quantity" não é um numero', async () => {
          request.body = {name: "jorginho", quantity:"22"}
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('422')).to.be.true;
          expect(response.json.calledWith( {message: '"quantity" must be a number'})).to.be.true;
        })
        it('Quando "quantity" não é um numero inteiro', async () => {
          request.body = {name: "jorginho", quantity:22.22} 
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('422')).to.be.true;
          expect(response.json.calledWith( {message: '"quantity" must an integer'})).to.be.true;
        })
        it('Quando "quantity" não é um numero maior que 0', async () => {
          request.body = {name: "jorginho", quantity: -2}
          await productsControllers.update(request, response, next)
          expect(response.status.calledWith('422')).to.be.true;
          expect(response.json.calledWith( {message: '"quantity" must be greater than or equal to 1'})).to.be.true;
        })
        })

    })

    describe('Deletar um produto do banco de dados', () => {
      describe('Quando o produto existe no banco de dados', () => {
        const serviceResponse = { code: 204 }
  
        beforeEach(() => {
          request.body = { name: 'azulejo', quantity: 333}
          sinon.stub(productsServices, 'exclude').resolves(serviceResponse);
        });
  
        afterEach(() => {
          productsServices.exclude.restore();
        });
  
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await productsControllers.exclude(request, response, next)
  
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
  
        it('Chama o response.json com {} ', async () =>{
          await productsControllers.exclude(request, response, next)
  
          expect(response.json.calledWith( {})).to.be.true;
        })

      })
      describe('Quando o produto não existe no banco', () => {
        const serviceResponse = {  code: 404, message: 'Product not found' }
    
        beforeEach(() => {
          request.body = { name: 'azulejo', quantity: 333}
          sinon.stub(productsServices, 'exclude').resolves(serviceResponse);
        });
    
        afterEach(() => {
          productsServices.exclude.restore();
        });
    
        it('Chama o response.status com o valor da propriedade "code" do serviceResponse', async () =>{
          await productsControllers.exclude(request, response, next)
    
          expect(response.status.calledWith(serviceResponse.code)).to.be.true;
        })
    
        it('Chama o response.json com o valor da propriedade "message" do serviceResponse ', async () =>{
          await productsControllers.exclude(request, response, next)
    
          expect(response.json.calledWith( {message: serviceResponse.message})).to.be.true;
        })
  
      })
    })
  })
})
