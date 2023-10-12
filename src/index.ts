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
import { db } from "./database/knex";

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
app.get("/users", async (req: Request, res: Response) => {
  try{
  const resultUsers = await db.raw(`SELECT * FROM users`);
  
  res.status(200).send(resultUsers);

  } catch(error){ 
    res.send(400)   
  }
});

//retorna produtos cadastrados
app.get("/products", async (req: Request, res: Response) => {
  
  try{
    const resultProducts = await db.raw(`SELECT * FROM products`);
    res.status(200).send(resultProducts);
    
  } catch(error){
    res.send(400)
  }
});

//retorna produtos filtrados
app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const query: string = req.query.q as string;

    if(query.length === 0) {
      res.statusCode = 404
      throw new Error('Query deve possuir pelo menos um caractere');
    }

    const productsByName = await db("products").where(
      "name",
      "like",
      `%${query}%`
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

app.post("/users", async (req: Request, res: Response) => {

  try {
    const { id, name, email, password } = req.body;

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

    const [isId] = await db.raw(`SELECT id FROM users WHERE id = "${id}"`)


    if(isId){
      //NÃO POSSO CADASTRAR
      res.status(400)
      throw new Error ("id inválido")
      
    }else{
      await db.raw(`INSERT INTO users (id, name, email, password)
      VALUES("${id}", "${name}", "${email}", "${password}")`);

      res.status(201).send("Cadastro realizado com sucesso");  
    }    
    
  }
   catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }
})

//------------------------criando um novo produto-----------------

app.post("/products", async (req: Request, res: Response) => {

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

    const [isIdProduct] = await db.raw(`SELECT id FROM products WHERE id = "${id}"`)
    
    if(isIdProduct){
      //NÃO POSSO CADASTRAR
      res.status(400)
      throw new Error ("id inválido")
      
    }else{
      await db.raw(`INSERT INTO products (id, name, price, description, image_url)
      VALUES("${id}", "${name}", ${price}, "${description}", "${imageUrl}")`);

      res.status(201).send("Produto cadastrado com sucesso");  
    } 
   
  } catch (error) {
    if(error instanceof Error){
      res.send(error.message) 
   }
  }
  
});

//-------------------------excluir usuario------------------

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    const [user] = await db.select("*").from("users").where({ id: idToDelete });

    if (!user) {
      res.status(404).send({ message: `Não existe uma conta com o id '${idToDelete}'`});
    }

    await db.delete().from("users").where({ id: idToDelete });
    console.log("Resultado da consulta SELECT:", user);

    res.status(200).send({ message: "O usuário foi deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(400).send("Erro ao deletar usuário");
  }
});

//-------------------------excluir produtos--------------------

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [product] = await db.raw(`'SELECT * FROM products WHERE id = ?', ${id}`);

    if (!product[0].length) {
      res.status(404).send({ message:` Não existe um produto com o id ${id}` });
      return;
    }

    await db.raw(`'DELETE FROM products WHERE id = ${product}`);

    res.status(200).send({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

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


// -------------------------purchase------------------

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, total_price } = req.body;

    console.log("@===>>>", id, buyer_id, total_price);

    if (typeof id !== "string" || id.length < 4) {
      res.statusCode = 404;
      throw new Error("O campo do 'id' é obrigatório");
    }

    if (typeof buyer_id !== "string" || buyer_id.length < 3) {
      res.statusCode = 404;
      throw new Error("O campo do 'buyer id' é obrigatório");
    }

    if (typeof total_price !== "number" || total_price <= 1) {
      res.statusCode = 404;
      throw new Error("O campo do 'preço' é obrigatório");
    }

    await db.raw(`INSERT INTO purchases
    (id, buyer_id, total_price)
    VALUES("${id}", "${buyer_id}", "${total_price}")`
    );

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

//------------------------ pegar todas purchases-------------------

app.get("/allpurchase", async (req: Request, res: Response) => {
  try {
    const resultPurchases = await db.raw(`SELECT * FROM purchases`);
    res.status(200).send(resultPurchases);
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
