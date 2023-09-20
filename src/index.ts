import {
  users,
  products,
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  searchProductsByName,
} from "./database";
import { TProducts, TUsers } from "./types";
import express, { Request, Response, query } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

//--------------------------ENDPOINT TEST-----------------
app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

// console.log("projeto rodando");

// console.log( users)
// console.log(products);

//-------------------------------criando um novo usuario---------------------------
const creatUserResult: string = createUser(
  "u003",
  "Laércio",
  "laercio@email.com",
  "laercio123456"
);

// console.log(creatUserResult)

// //imprimindo a lista de usuarios
const userList = getAllUsers();
// console.log(userList)

//------------------------------criando novo produto-----------------------------
const creatProductResult: string = createProduct(
  "prod003",
  "SSD gamer",
  349.99,
  "Acelere seu sistema com velocidades incríveis de leitura e gravação.",
  "https://images.unsplash.com/photo"
);

// console.log(creatProductResult)

const productsList: TProducts[] = getAllProducts();
// console.log(productsList)

//------------------------------procurar por nome-------------------------------
const searchResult: TProducts[] = searchProductsByName("gamer");
// console.log(searchResult);

//--------------------------USANDO ENDPOINT--------------------
//retorna usuarios cadastrados
app.get("/users", (req: Request, res: Response) => {
  try{
  const resultUsers: TUsers[] = users;
  
  res.status(200).send(resultUsers);

  } catch(error){ 
    res.send(400)   
  }
});

//retorna produtos cadastrados
app.get("/products", (req: Request, res: Response) => {
  
  try{
    const resultProducts: TProducts[] = products;
    res.status(200).send(resultProducts);
    
  } catch(error){
    res.send(400)
  }
});

//retorna produtos filtrados
app.get("/products/search", (req: Request, res: Response): void => {
  try {
    const query: string = req.query.q as string;

    if(query.length === 0) {
      res.statusCode = 404
      throw new Error('Query deve possuir pelo menos um caractere');
    }

    const productsByName: TProducts[] = products.filter(
      (product) => product.name.toLowerCase().startsWith(query.toLowerCase())
    );

    if (productsByName.length === 0) {
      res.statusCode = 404
      throw new Error(`Nenhum produto encontrado para a query '${query}'`);
    }

    res.status(200).send(productsByName);

  } catch (error) {
    if(error instanceof Error) {
      res.send(error.message);
    } else {
      res.send('Erro: a query deve possuir pelo menos um caractere');
    }
  }
});

//------------------------criando um novo usuario----------------------

app.post("/users", (req: Request, res: Response) => {

  try {
    const { id, name, email, password }: TUsers = req.body;

    if (typeof id !== "string"){
      res.statusCode = 400
      throw new Error("Id invalido.");
    }

    if(typeof name !== "string"){
      res.statusCode = 400
      throw new Error("Name invalido.");
    }

    if (typeof email !== "string"){
      res.statusCode = 400
      throw new Error("Email invalido.");
    }

    if(typeof password !== "string"){
      res.statusCode = 400
      throw new Error("Password invalido.");
    }

     // Verificar se um usuário com o mesmo ID ou e-mail já existe
     const existingUserById: TUsers | undefined = users.find((user) => user.id === id);
     const existingUserByEmail: TUsers | undefined = users.find((user) => user.email === email);
 
     if (existingUserById) {
        res.statusCode = 400
        throw new Error("Já existe um usuário com o mesmo ID.");
     }
 
     if (existingUserByEmail) {
        res.statusCode = 400
       throw new Error("Já existe um usuário com o mesmo e-mail.");
     }

    const newUser: TUsers = {
      id,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    res.status(201).send("Cadastro realizado com sucesso");
  }
   catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }
})

//------------------------criando um novo produto-----------------

app.post("/products", (req: Request, res: Response) => {

  try {
    const { id, name, price, description, imageUrl }: TProducts = req.body;

    if (typeof id !== "string"){
      res.statusCode = 400
      throw new Error("Id invalido.");
    }

    if(typeof name !== "string"){
      res.statusCode = 400
      throw new Error("Name invalido.");
    }

    if (typeof price !== "number"){
      res.statusCode = 400
      throw new Error("price invalido.");
    }

    if(typeof description !== "string"){
      res.statusCode = 400
      throw new Error("description invalido.");
    }

    if(typeof imageUrl !== "string"){
      res.statusCode = 400
      throw new Error("imageUrl invalido.");
    }
    
    //Verificar se um produto com o mesmo ID existe
    const existingProductById: TProducts | undefined = products.find((product) => product.id === id);

    if(existingProductById){
      res.statusCode = 400
      throw new Error("Já existe um produto com o mesmo ID.");
    }

    const newProduct: TProducts = {
      id,
      name,
      price,
      description,
      imageUrl,
    };
    products.push(newProduct);

    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }
  
});

//-------------------------excluir usuario------------------

app.delete("/users/:id", (req:Request, res: Response) =>{

  try {
    const id: string = req.params.id
    const indexToDelete: number = users.findIndex((user) => user.id === id)

    if(indexToDelete >= 0){
        users.splice(indexToDelete, 1)
        res.status(200).send({message: "User apagado com sucesso"})
    } else{
      res.status(400).send({message: "usuario não encontrado"})
    }

  } catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }
  
})

//-------------------------excluir produtos--------------------

app.delete("/products/:id", (req:Request, res: Response) =>{

  try {
    const id: string = req.params.id
    const indexToDelete: number = products.findIndex((product) => product.id === id)

    if(indexToDelete >= 0){
        products.splice(indexToDelete, 1)
        res.status(200).send({message: "produto apagado com sucesso"})
    } else{
      res.status(400).send({message: "produto não encontrado"})
    }
  } catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }
})

//----------------------Editar produtos----------------------

app.put("/products/:id", (req: Request, res: Response) => {

  try {
    const id: string = req.params.id 

     // Validar se o produto existe antes de editar
     const indexProduct: number = products.findIndex((product) => product.id === id);

     if (indexProduct === -1) {
       return res.status(404).send({ mensagem: "Produto não encontrado" });
     }

    const newId = req.body.id as string | undefined
    const newProductName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDescription = req.body.description as string | undefined
    const newImageUrl = req.body.imahge as string | undefined

    const newProduct: TProducts | undefined = products.find((item)=>item.id === id)

    if (newProduct) {
      newProduct.id = newId || newProduct.id
      newProduct.name = newProductName || newProduct.name
      newProduct.price = newPrice || newProduct.price
      newProduct.imageUrl = newImageUrl || newProduct.imageUrl
      newProduct.description = newDescription || newProduct.description
    }

    res.status(200).send({message:"alteração feita com sucesso"})
  } catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }

})
