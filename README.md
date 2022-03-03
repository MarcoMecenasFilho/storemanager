<img src='./images/logo.gif' width="100%">
<br>
<hr>

<h4 align="center"> 
	🚧   StoreManager 🚀 Finalizado  🚧
</h4>


<br>
<h2>Sobre</h2>
<p align="justify"> Store Manager é uma aplicação desenvolvida para gerenciar o estoque de produtos
e vendas realizar, sendo realizado apenas o backend da aplicação </p 

### Features

-  Cadastro de vendas e produtos
-  Atualizar e deletar vendas e produtos
-  sistema de controle de produtos automatizado
<br>
## 🛠 Tecnologias

As seguintes ferramentas foram utilizadas na construção do projeto:

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources)
- [expressJs](https://expressjs.com/pt-br/)
- [Node.js](https://nodejs.org/en/)
- [Body-parser](https://www.npmjs.com/package/body-parser)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Joi](https://joi.dev/)
- [Mysql2](https://www.npmjs.com/package/mysql2)
- [Mocha](https://mochajs.org/)
- [Chain](https://www.npmjs.com/package/chain)
- [Sinon](https://sinonjs.org/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Nyc](https://www.npmjs.com/package/nyc)

<br>
<h2>Instalar o projeto em sua máquina</h2>
<br>
<h3>Pré-requisitos</h3>

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/). É necessário ter  instalado e configurado o [Mysql](https://dev.mysql.com/doc/). Para uma melhor visualização do banco de dados indico a  utilização [MysqlWorkBench](https://www.mysql.com/products/workbench/) e possuir um editor de código, sugiro  o [VSCode](https://code.visualstudio.com/). Para fazer as requisições nos endpoints recomendo o [Postman](https://www.postman.com/).


Para criar o banco de dados, copie todo o conteúdo do arquivo StoreManager.sql e
cole no  workbench. Rode todas as query, assim o banco estará online localmente.
Para utilizar o banco de dados na aplicação. Renomeio o arquivo .env.example para .env
e troque as informações para as que foram criadas quando o MySQL foi configurado. O PORT deve permanecer 3000.

###  Rodando a aplicação .

```bash
# Clone este repositório
# Foi utilizado SSH
$ git clone git@github.com:MarcoMecenasFilho/storemanager

# Acesse a pasta do projeto no seu terminal/cmd
$ cd storemanager

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run debug

```

### Rodando os testes
```bash
# Para rodar os testes
$  npm run test:mocha

```




## Métodos
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` | Retorna informações de um ou mais produtos/vendas. |
| `POST` | Utilizado para criar um novo produto/venda. |
| `PUT` | Atualiza dados de um produto/venda ou altera sua situação. |
| `DELETE` | Remove um produto/venda do sistema. |


## Respostas

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `201` | Criado com sucesso com sucesso.|
| `204` | Sem conteúdo.|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|
| `405` | Método não implementado.|
| `410` | Registro pesquisado foi apagado do sistema e não esta mais disponível.|
| `422` | Dados informados estão fora do escopo definido para o campo.|
| `429` | Número máximo de requisições atingido. (*aguarde alguns segundos e tente novamente*)|

<br>

## EndPoints

# Produtos [/products]

### Listar /products [GET]

Listar todos os produtos salvos no banco de dados  /products

+ Response 200 (application/json)

          [
              {
                "id": 1,
                "name": "Martelo de Thor",
                "quantity": 10
              },
              {
                "id": 2,
                "name": "Traje de encolhimento",
                "quantity": 20
              },
              {
                "id": 3,
               "name": "Escudo do Capitão América",
                "quantity": 30
              }
          ]


### Listar por id /products/id [GET]

Listar produto por um id específico /products/1

+ Response 200 (application/json)

          {
            "id": 1,
            "name": "Martelo de Thor",
            "quantity": 10
          }
          
### Quando o produto não existe /products/5
          
+ Response 404 (application/json)

          {
            "message": "Product not found"
          }

### Criar /products [POST]
+ Request (application/json)

    + body

            {           
                "name": "blusa azul",
                "quantity": 300
            }
+ Response 201 (application/json)

          {
            "id": 4,
            "name": "blusa azul",
            "quantity": 300
          }

#### Quando as validações falham

Quando "name" não é passado.

+ Request (application/json)

    + body

            {           
                "quantity": 300
            }
+ Response 400 (application/json)

          {
              "message": "\"name\" is required" 
          }

Quando "name" não é uma string.

+ Request (application/json)

    + body

            {        
                "name": 200,   
                "quantity": 300
            }
+ Response 422 (application/json)

          {
              "message": "\"name\" must be a string"
          }

Quando "name" possui menos de 5 caracteres.

+ Request (application/json)

    + body

            {        
                "name": "cas",   
                "quantity": 300
            }
+ Response 422 (application/json)

          {
              "message": "\"name\" length must be at least 5 characters long"
          }

Quando "quantity" não é passado.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul"
            }
+ Response 400 (application/json)

          {
              "message": "\"quantity\" is required"
          }

Quando "quantity" não é um number.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul",
                "quantity": "300"
            }
+ Response 422 (application/json)

          {
              "message": "\"quantity\" must be a number"
          }

Quando "quantity" não é um numero inteiro.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul",
                "quantity": 3.22
            }
+ Response 422 (application/json)

          {
               "message": "\"quantity\" must an integer"
          }

Quando "quantity" não é um numero positivo.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul",
                "quantity": -2
            }
+ Response 422 (application/json)

          {
                "message": "\"quantity\" must be greater than or equal to 1"
          }

### Atualizar /products/id  [PUT]

Passamos o id do produto que queremos atualizar /products/4

+ Request (application/json)

    + body

            {  
                "name": "blusa verde",
                "quantity": 300
            }

+ Response 200 (application/json)

          {
            "id": 4,
            "name": "blusa verde",
            "quantity": 300
          }

Passamos o id de um  produto que não existe /products/89

+ Request (application/json)

    + body

            {  
                "name": "blusa verde",
                "quantity": 300
            }

+ Response 404 (application/json)

          {
            "message": "Product not found"
          }

#### Quando as validações falham

Quando "name" não é passado.

+ Request (application/json)

    + body

            {           
                "quantity": 300
            }
+ Response 400 (application/json)

          {
              "message": "\"name\" is required" 
          }

Quando "name" não é uma string.

+ Request (application/json)

    + body

            {        
                "name": 200,   
                "quantity": 300
            }
+ Response 422 (application/json)

          {
              "message": "\"name\" must be a string"
          }

Quando "name" possui menos de 5 caracteres.

+ Request (application/json)

    + body

            {        
                "name": "cas",   
                "quantity": 300
            }
+ Response 422 (application/json)

          {
              "message": "\"name\" length must be at least 5 characters long"
          }

Quando "quantity" não é passado.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul"
            }
+ Response 400 (application/json)

          {
              "message": "\"quantity\" is required"
          }

Quando "quantity" não é um number.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul",
                "quantity": "300"
            }
+ Response 422 (application/json)

          {
              "message": "\"quantity\" must be a number"
          }

Quando "quantity" não é um numero inteiro.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul",
                "quantity": 3.22
            }
+ Response 422 (application/json)

          {
               "message": "\"quantity\" must an integer"
          }

Quando "quantity" não é um numero positivo.

+ Request (application/json)

    + body

            {        
                "name": "camisa azul",
                "quantity": -2
            }
+ Response 422 (application/json)

          {
                "message": "\"quantity\" must be greater than or equal to 1"
          }

### Deletar /products/id  [DELETE]

Para deletar um produto passamos o id desejado /products/4


+ Response 204

Id de um  produto que não existe /products/89

+ Response 404 (application/json)

          {
            "message": "Product not found"
          }


# Vendas [/sales]

### Listar /sales [GET]

Listar todos as vendas salvos no banco de dados  /sales

+ Response 200 (application/json)

          [
              {
                "saleId": 1,
                "date": "2022-03-02T18:45:07.000Z",
                "productId": 1,
                "quantity": 5
              },
              {
                "saleId": 1,
                "date": "2022-03-02T18:45:07.000Z",
                "productId": 2,
                "quantity": 10
              },
              {
                "saleId": 2,
                "date": "2022-03-02T18:45:07.000Z",
                "productId": 3,
                "quantity": 15
              }
          ]



### Listar por id /sales/id [GET]

Listar venda por um id específico /sales/2

+ Response 200 (application/json)

          [
              {
                "date": "2022-03-02T18:45:07.000Z",
                "productId": 2,
                "quantity": 15
              }
          ]
          
### Quando o produto não existe /products/5
          
+ Response 404 (application/json)

      [
        {
          "message": "Product not found"
        }
      ]  

### Criar  /sales/id [POST]

+ Request (application/json)

  + body

        [
          {
            "productId": 1,
            "quantity": 2
          },
          {
            "productId": 2,
            "quantity": 5
          }
        ]

+ Response 201 (application/json)

          {
              "id": 3,
              "itemsSold": [
                {
                  "productId": 1,
                  "quantity": 2
                },
                {
                  "productId": 2,
                  "quantity": 5
                }
              ]
          }

Quando a quantidade do produto não existe no banco de dados.

+ Request (application/json)

    + body

          [
            {
              "productId": 1,
              "quantity": 200
            },
            {
              "productId": 2,
              "quantity": 1
            }
              {
              "productId": 3,
              "quantity": 100
            }
          ]

+ Response 422 (application/json)

          {
              "message": "Such amount is not permitted to sell. ProductId: 1, 3"
          }

Quando o id do produto não existe no banco de dados.

+ Request (application/json)

    + body

          [
            {
              "productId": 1,
              "quantity": 2
            },
            {
              "productId": 67,
              "quantity": 1
            },
              {
              "productId": 99,
              "quantity": 1
            }
          ]

+ Response 404 (application/json)

          {
              "message": "Product not found. ProductId: 67, 99"
          }

#### Quando as validações falham

Quando "quantity" não é passado.

+ Request (application/json)

    + body

          [
            {    
                "productId: 1
            }
          ]

+ Response 400 (application/json)

          {
              "message": "\"quantity\" is required"
          }

Quando "quantity" não é um number.

+ Request (application/json)

    + body

          [
            {        
                "productId: 1,
                "quantity": "300"
            }
          ]

+ Response 422 (application/json)

          {
              "message": "\"quantity\" must be a number"
          }

Quando "quantity" não é um numero inteiro.

+ Request (application/json)

    + body

          [
            {        
                "productId: 1,
                "quantity": 3.22
            }
          ]

+ Response 422 (application/json)

          {
               "message": "\"quantity\" must an integer"
          }

Quando "quantity" não é um numero positivo.

+ Request (application/json)

    + body

          [
            {        
                "productId: 1,
                "quantity": -2
            }
          ]

+ Response 422 (application/json)

          {
                "message": "\"quantity\" must be greater than or equal to 1"
          }

Quando "productId" não é passado.

+ Request (application/json)

    + body

          [
            {    
                "quantity": 1
            }
          ]

+ Response 400 (application/json)

          {
              "message": "\"productId\" is required"
          }

Quando "productId" não é um number.

+ Request (application/json)

    + body

          [
            {        
                "productId": "3"
                "quantity": 1,
            }
          ]

+ Response 422 (application/json)

          {
              "message": "\"productId\" must be a number"
          }

Quando "productId" não é um numero inteiro.

+ Request (application/json)

    + body

          [  
            {        
                "productId": 3.22
                "quantity: 1,
            }
          ]

+ Response 422 (application/json)

          {
               "message": "\"productId\" must an integer"
          }

Quando "productId" não é um numero positivo.

+ Request (application/json)

    + body

          [
              {        
                "productId": -2,
                "quantity: 1
              }
          ]

+ Response 422 (application/json)

          {
                "message": "\"productId\" must be greater than or equal to 1"
          }

### Atualizar  /sales/id [PUT]

+ Request (application/json)

    + body

          [
            {
              "productId": 1,
              "quantity": 1
            }
          ]

+ Response 200 (application/json)

          {
              "saleId": 1,
              "itemUpdate": [
                {
                  "productId": 1,
                  "quantity": 1
                }
              ]
          }

Quando a quantidade do produto não existe no banco de dados.

+ Request (application/json)

    + body

          [
            {
              "productId": 1,
              "quantity": 200
            }
          ]

+ Response 422 (application/json)

          {
              "message": "Such amount is not permitted to sell"
          }

Quando o id do produto não existe no banco de dados.

+ Request (application/json)

    + body

            [
              {
                "productId": 89,
                "quantity": 2
              }
            ]

+ Response 404 (application/json)

          {
              "message": "Product not found"
          }

#### Quando as validações falham

Quando "quantity" não é passado.

+ Request (application/json)

    + body

          [
            {    
                "productId: 1
            }
          ]

+ Response 400 (application/json)

          {
              "message": "\"quantity\" is required"
          }

Quando "quantity" não é um number.

+ Request (application/json)

    + body

          [
            {        
                "productId: 1,
                "quantity": "300"
            }
          ]

+ Response 422 (application/json)

          {
              "message": "\"quantity\" must be a number"
          }

Quando "quantity" não é um numero inteiro.

+ Request (application/json)

    + body

          [
            {        
                "productId: 1,
                "quantity": 3.22
            }
          ]

+ Response 422 (application/json)

          {
               "message": "\"quantity\" must an integer"
          }

Quando "quantity" não é um numero positivo.

+ Request (application/json)

    + body

          [
            {        
                "productId: 1,
                "quantity": -2
            }
          ]

+ Response 422 (application/json)

          {
                "message": "\"quantity\" must be greater than or equal to 1"
          }

Quando "productId" não é passado.

+ Request (application/json)

    + body

          [
            {    
                "quantity": 1
            }
          ]

+ Response 400 (application/json)

          {
              "message": "\"productId\" is required"
          }

Quando "productId" não é um number.

+ Request (application/json)

    + body

          [
            {        
                "productId": "3"
                "quantity": 1,
            }
          ]

+ Response 422 (application/json)

          {
              "message": "\"productId\" must be a number"
          }

Quando "productId" não é um numero inteiro.

+ Request (application/json)

    + body

          [  
            {        
                "productId": 3.22
                "quantity: 1,
            }
          ]

+ Response 422 (application/json)

          {
               "message": "\"productId\" must an integer"
          }

Quando "productId" não é um numero positivo.

+ Request (application/json)

    + body

          [
              {        
                "productId": -2,
                "quantity: 1
              }
          ]

+ Response 422 (application/json)

          {
                "message": "\"productId\" must be greater than or equal to 1"
          }

### Deletar /sales/id  [DELETE]

Para deletar um produto passamos o id desejado /products/4


+ Response 204

Id de um  produto que não existe /products/89

+ Response 404 (application/json)

          {
            "message": "Product not found"
          }


 - Este projeto foi feito com muita dedicação e carinho por Marco Mecenas  [Entre em contato!](https://www.linkedin.com/in/marcomecenasfilho/).