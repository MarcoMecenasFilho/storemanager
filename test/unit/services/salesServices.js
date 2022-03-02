const sinon = require('sinon');
const { expect } = require('chai');
const salesModels = require('../../../models/salesModels')
const salesServices = require('../../../services/salesServices');
const productsModels = require('../../../models/productsModels')

describe('Service TESTS SALES', async () => {
  describe('checa produtos no  banco de dados', async () => {
    const modelResponse = [
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
    ];
    const servicesSuccessResponse = { code: 200, data: modelResponse }
  
    beforeEach(() => {
      sinon.stub(salesModels, 'getAll').resolves(modelResponse);
    })

    afterEach(() => {
    salesModels.getAll.restore();
    });

    it('Retorna um objeto', async () => {
      const result = await salesServices.getAll();

      expect(result).to.be.an('object')
    })
    it('Retorna um objeto com code e data', async () => {
      const result = await salesServices.getAll();
  
      expect(result).to.be.deep.equal(servicesSuccessResponse)
    })
  })
      
  describe('Procurar produto por Id que existe no BD', async() => {
    const modelResponse = [
      { date: '2022-02-24T15:40:47.000Z', productId: 3, quantity: 15 } ,
    ];
    const servicesSuccessResponse = {
      code: 200,
      data: [ { date: '2022-02-24T15:40:47.000Z',
      productId: 3, 
      quantity: 15 } ]
    }
    
    beforeEach(() => {
      sinon.stub(salesModels, 'getById').resolves(modelResponse);
    })

    afterEach(() => {
    salesModels.getById.restore();
    });

  it('Retorna um objeto', async () => {
    const result = await salesServices.getById();

    expect(result).to.be.an('object')
  })
  it('Retorna um objeto com code e data', async () => {
    const result = await salesServices.getById();

    expect(result).to.be.deep.equal(servicesSuccessResponse)
  })
    
  })

  describe('Procurar venda por Id que não existe no BD', () => {

    const modelResponse = [];
    const servicesSuccessResponse = {
      code: 404,
      message: 'Sale not found',
    }
    
  beforeEach(() => {
    sinon.stub(salesModels, 'getById').resolves(modelResponse);
  })

  afterEach(() => {
  salesModels.getById.restore();
  });

  it('Retorna um objeto', async () => {
    const result = await salesServices.getById();

    expect(result).to.be.an('object')
  })
  it('Retorna um objeto com code e message', async () => {
    const result = await salesServices.getById();

    expect(result).to.be.deep.equal(servicesSuccessResponse)
  })
});

describe('Deleta uma venda e atualiza a quantidade de produtos', async() => {
  const saleData = {id: 1}
  
  describe('Caso a venda exista no banco', () => {
    const getByIdResponse = [{  
      "date": "2021-09-09T04:54:29.000Z",
      "productId": 1,
      "quantity": 2
    }];
    const updateProductDeleteResponse = { affectedRows: 1 }
    const modelDeleteResponse = { affectedRows: 0 }
    const serviceResponse = {code: 204}

    beforeEach(() => {
      sinon.stub(salesModels, 'getById').resolves(getByIdResponse)
      sinon.stub(salesModels, 'exclude').resolves(modelDeleteResponse)
      sinon.stub(productsModels, 'updateProductDelete').resolves(updateProductDeleteResponse);
    })
      afterEach(() => { salesModels.exclude.restore();
      salesModels.getById.restore();
      productsModels.updateProductDelete.restore();});

    it('retornar um objeto com code 204', async () => {
      const result = await salesServices.exclude(saleData.id);

      expect(result).to.be.deep.equal(serviceResponse)
    })
  } )
  describe('Caso a venda não exista no banco', async() => {
    const getByIdResponse = [{  
      "date": "2021-09-09T04:54:29.000Z",
      "productId": 1,
      "quantity": 2
    }];
    const updateProductDeleteResponse = { affectedRows: 1 }
    const modelResponse = { message: 'Sale not found' }
    const serviceResponse = { code: 404, message: modelResponse.message }
    
    beforeEach(() => {
      sinon.stub(salesModels, 'getById').resolves(getByIdResponse)
      sinon.stub(salesModels, 'exclude').resolves(modelResponse)
      sinon.stub(productsModels, 'updateProductDelete').resolves(updateProductDeleteResponse);
    })
      afterEach(() => { 
      salesModels.getById.restore();
      salesModels.exclude.restore();
      productsModels.updateProductDelete.restore();});

    it('retornar um objeto com code 404 e message "Sale not found"', async () => {
      const result = await salesServices.exclude(saleData.id);
      expect(result).to.be.deep.equal(serviceResponse)
    })
  } )
})


describe('Adiciona uma venda', async  () => {
  describe('O produto e quantidade inseridas na venda  existem no banco',  async () => {
    const  saleData = [{productId: 9, quantity: 300}];
  
    const  updateProductSaleResponse =  { productId: 9, affectedRows: 1 , changed: 1, quantity: 300 };
    const createSaleResponse = {insertId: 1};
    const createProductSaleResponse = {};
    const serviceResponse =  { code: 201, data: { id: createSaleResponse.insertId, itemsSold: saleData } };
    beforeEach(() => {
      sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);
      sinon.stub(salesModels, 'createSale').resolves(createSaleResponse);
      sinon.stub(salesModels, 'createProductSale').resolves(createProductSaleResponse);
    });
    afterEach(() => { 
      productsModels.updateProductSale.restore();
      salesModels.createSale.restore();
      salesModels.createProductSale.restore();
    });
    
    it('Retorna um objeto com code e data', async () => {
      const result = await salesServices.create(saleData);
      expect(result).to.be.deep.equal(serviceResponse)
    })
  })
  describe('A quantidade de produtos inseridas na venda, não existe no banco', async () => {
    const  saleData = [{productId: 5, quantity: 300}];
    const  updateProductSaleResponse =  { productId: 5, affectedRows:1 , changed:0, quantity: 300 };
    const serviceResponse =  { code: 422, message: `Such amount is not permitted to sell. ProductId: 5` };
    beforeEach(() => {
      sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);
    })
    afterEach(() => { 
      productsModels.updateProductSale.restore();
    }
    )
    it('Retorna um objeto com code e message', async () => {
      const result = await salesServices.create(saleData);
      expect(result).to.be.deep.equal(serviceResponse)
    })
  })

  
  describe('Quando o produto não  existe no banco', async () => {
    const  saleData = [{productId: 7, quantity: 300}];
    const  updateProductSaleResponse =  { productId: 7, affectedRows: 0 , changed: 0, quantity: 300 }
    const serviceResponse =  { code: 404, message: 'Product not found. ProductId: 7'}
    beforeEach(() => {
      sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);
    })
    afterEach(() => { 
      productsModels.updateProductSale.restore();
    })
    it('Retorna um objeto com code e message', async () => {
      const result = await salesServices.create(saleData);
      expect(result).to.be.deep.equal(serviceResponse)
    })

  })
  })

  describe('Quando atualizamos uma venda', async () => {
    describe('Testa a função addProduct', async () => {
    const saleData = {saleId: 1, productId: 1 ,quantity: 200, restOfUpdate:6}
    const updateProductDeleteResponse = {}
    const updateResponse = {}
    const serviceResponse = { code: 200,
      data: { saleId: saleData.saleId,
        itemUpdated:[{ productId: saleData.productId, quantity: saleData.quantity }] } };
        beforeEach(() => {
          sinon.stub(productsModels, 'updateProductDelete').resolves(updateProductDeleteResponse);
          sinon.stub(salesModels, 'update').resolves(updateResponse);
        })
        afterEach(() => { 
          productsModels.updateProductDelete.restore();
          salesModels.update.restore()
        })
        it('Retorna um objeto com code e data', async () => {
          const result = await salesServices
          .addProducts(saleData.saleId, saleData.productId,
            {quantity: saleData.quantity,
              restOfUpdate: saleData.restOfUpdate});

          expect(result).to.be.deep.equal(serviceResponse)
        })
    })
    describe('Testa a função removeProducts', async () => {
      describe('Quando a quantidade de produtos existe no banco', async () => {
      const saleData = {saleId: 1, productId: 1 ,quantity: 200, restOfUpdate:6}
      const updateProductSaleResponse = {changed: 1}
      const updateResponse = {}
      const serviceResponse = { code: 200,
        data: { saleId: saleData.saleId,
          itemUpdated:[{ productId: saleData.productId, quantity: saleData.quantity }] } };
          beforeEach(() => {
            sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);
            sinon.stub(salesModels, 'update').resolves(updateResponse);
          })
          afterEach(() => { 
            productsModels.updateProductSale.restore();
            salesModels.update.restore()
          })
          it('Retorna um objeto com code e data', async () => {
            const result = await salesServices
            .removeProducts(saleData.saleId, saleData.productId,
              {quantity: saleData.quantity,
                restOfUpdate: saleData.restOfUpdate});
  
            expect(result).to.be.deep.equal(serviceResponse)
          })
        })
        describe('Quando a quantidade de produtos não existe no banco', async () => {
          const saleData = {saleId: 1, productId: 1 ,quantity: 200, restOfUpdate:6}
          const updateProductSaleResponse = {changed: 0}
          const updateResponse = {}
          const serviceResponse = { code: 422, message: 'Such amount is not permitted to sell' };
              beforeEach(() => {
                sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);
                sinon.stub(salesModels, 'update').resolves(updateResponse);
              })
              afterEach(() => { 
                productsModels.updateProductSale.restore();
                salesModels.update.restore()
              })
              it('Retorna um objeto com code e message', async () => {
                const result = await salesServices
                .removeProducts(saleData.saleId, saleData.productId,
                  {quantity: saleData.quantity,
                    restOfUpdate: saleData.restOfUpdate});
      
                expect(result).to.be.deep.equal(serviceResponse)
              })
            })
      })
      describe('Quando a venda não existe no banco', () => {
        const saleData = {saleId: 1, productId: 1 ,quantity: 200}
      const getByIdResponse = []
      const serviceResponse = { code: 404, message: 'Sale not found' };
          beforeEach(() => {
            sinon.stub(salesModels, 'getById').resolves(getByIdResponse);
          })
          afterEach(() => { 
            salesModels.getById.restore();
          })
          it('Retorna um objeto com code e message', async () => {
            const result = await salesServices
            .update(saleData.saleId, saleData.productId, saleData.quantity);
  
            expect(result).to.be.deep.equal(serviceResponse)
          })
      })
      describe('Quando o produto não existe na venda', () => {
        const saleData = {saleId: 1, productId: 1 ,quantity: 200}
      const getByIdResponse = [{productId: 2, quantity: 30}]
      const serviceResponse = { code: 404, message: 'Product not found' };
          beforeEach(() => {
            sinon.stub(salesModels, 'getById').resolves(getByIdResponse);
          })
          afterEach(() => { 
            salesModels.getById.restore();
          })
          it('Retorna um objeto com code e message', async () => {
            const result = await salesServices
            .update(saleData.saleId, saleData.productId, saleData.quantity);
  
            expect(result).to.be.deep.equal(serviceResponse)
          })
      })
      describe('Quando o a quantidade do produto atualizado é menor do que a atual', () => {
        const saleData = {saleId: 1, productId: 1 ,quantity: 20}
        const getByIdResponse = [{productId: 1, quantity: 30}]
        const updateProductDeleteResponse = {}
        const updateResponse = {}
        const serviceResponse = { code: 200,
          data: { saleId: saleData.saleId,
            itemUpdated: [{ productId: saleData.productId, quantity: saleData.quantity }] } };

            beforeEach(() => {
              sinon.stub(salesModels, 'getById').resolves(getByIdResponse);
              sinon.stub(productsModels, 'updateProductDelete').resolves(updateProductDeleteResponse);
              sinon.stub(salesModels, 'update').resolves(updateResponse);

            })
            afterEach(() => { 
              salesModels.getById.restore();
              salesModels.update.restore();
              productsModels.updateProductDelete.restore()
            })
            it('Retorna um objeto com code e message', async () => {
              const result = await salesServices
              .update(saleData.saleId, saleData.productId, saleData.quantity);
    
              expect(result).to.be.deep.equal(serviceResponse)
            })
      })

      describe(`Quando  a quantidade do produto atualizado é maior do que a atual, 
      e essa diferença não existe na quantidade de produtos do banco`, () => {
        const saleData = {saleId: 1, productId: 1 ,quantity: 30}
        const getByIdResponse = [{productId: 1, quantity: 10}]
        const updateProductSaleResponse = { changed: 0}
        const updateResponse = {insertId: 1}
        const serviceResponse = { code: 422, message: 'Such amount is not permitted to sell' };
            beforeEach(() => {
              sinon.stub(salesModels, 'getById').resolves(getByIdResponse);
              sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);

            })
            afterEach(() => { 
              salesModels.getById.restore();
              productsModels.updateProductSale.restore()
            })
            it('Retorna um objeto com code e message', async () => {
              const result = await salesServices
              .update(saleData.saleId, saleData.productId, saleData.quantity);
    
              expect(result).to.be.deep.equal(serviceResponse)
            })
          })
          describe(`Quando a quantidade do produto atualizado é maior do que a atual, 
          e essa diferença  existe na quantidade de produtos do banco`, () => {
            const saleData = {saleId: 1, productId: 1 ,quantity: 30}
            const getByIdResponse = [{productId: 1, quantity: 10}]
            const updateProductSaleResponse = { changed: 1}
            const updateResponse = {insertId: 1}
            const serviceResponse = { code: 200,
              data: { saleId: saleData.saleId,
                itemUpdated: [{ productId: saleData.productId, quantity: saleData.quantity }] } };
                
                beforeEach(() => {
                  sinon.stub(salesModels, 'getById').resolves(getByIdResponse);
                  sinon.stub(productsModels, 'updateProductSale').resolves(updateProductSaleResponse);
                  sinon.stub(salesModels, 'update').resolves(updateResponse);
        
                })
                afterEach(() => { 
                  salesModels.getById.restore();
                  salesModels.update.restore();
                  productsModels.updateProductSale.restore()
                })
                it('Retorna um objeto com code e message', async () => {
                  const result = await salesServices
                  .update(saleData.saleId, saleData.productId, saleData.quantity);
        
                  expect(result).to.be.deep.equal(serviceResponse)
                })
              })
  })
});
