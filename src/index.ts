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
  const resultUsers: TUsers[] = users;

  res.status(200).send(resultUsers);
});

//retorna produtos cadastrados
app.get("/products", (req: Request, res: Response) => {
  const resultProducts: TProducts[] = products;

  res.status(200).send(resultProducts);
});

//retorna produtos filtrados
app.get("/products/search", (req: Request, res: Response) => {
  const query: string | undefined = req.query.q as string | undefined;

  if (query === undefined) {
    return res.status(200).send(products);
  }

  const productsByName: TProducts[] | undefined = products.filter(
    (products) => products.name.toLowerCase() === query.toLowerCase()
  );

  if (!productsByName.length) {
    return res.status(200).send(products);
  }

  res.status(200).send(productsByName);
});

//------------------------criando um novo usuario----------------------

app.post("/users", (req: Request, res: Response) => {
  const { id, name, email, password }: TUsers = req.body;

  const newUser: TUsers = {
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);

  res.status(201).send("Cadastro realizado com sucesso");
});

//------------------------criando um novo produto-----------------

app.post("/products", (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl }: TProducts = req.body;

  const newProduct: TProducts = {
    id,
    name,
    price,
    description,
    imageUrl,
  };
  products.push(newProduct);

  res.status(201).send("Produto cadastrado com sucesso");
});


//-------------------------excluir usuario------------------

app.delete("/users/:id", (req:Request, res: Response) =>{
  const id = req.params.id
  const indexToDelete = users.findIndex((user) => user.id === id)

  if(indexToDelete >= 0){
      users.splice(indexToDelete, 1)
  } else{
      console.log("deu ruim, não deletou")
  }

  res.status(200).send("User apagado com sucesso")
})


//-------------------------excluir produtos--------------------


app.delete("/products/:id", (req:Request, res: Response) =>{
  const id = req.params.id
  const indexToDelete = products.findIndex((product) => product.id === id)

  if(indexToDelete >= 0){
      products.splice(indexToDelete, 1)
  } else{
      console.log("deu ruim, não deletou")
  }

  res.status(200).send("Produto apagado com sucesso")
})

//----------------------Editar produtos----------------------

app.put("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id 

const newId = req.body.id as string | undefined
const newProductName = req.body.name as string | undefined
const newPrice = req.body.price as number | undefined
const newDescription = req.body.description as string | undefined
const newImageUrl = req.body.imahge as string | undefined


const newProduct = products.find((item)=>item.id === id)

if (newProduct) {
  newProduct.id = newId || newProduct.id
  newProduct.name = newProductName || newProduct.name
  newProduct.price = newPrice || newProduct.price
  newProduct.imageUrl = newImageUrl || newProduct.imageUrl
  newProduct.description = newDescription || newProduct.description

}

  res.status(200).send({message:"alteração feita com sucesso"})
})




// app.put("/products/:id", (req: Request, res: Response) => {
//   const id = req.params.id

//   const newName = req.body.name as string | undefined
//   const newPrice = req.body.price as number | undefined
//   const newDescription = req.body.description as string | undefined
//   const newImageUrl = req.body.imageUrl as string | undefined

//   const product = products.find((product) => product.id === id)

//   product.name = newName || product.name
//   product.description = newDescription || product.description
//   product.imageUrl = newImageUrl || product.imageUrl

//   // if (newName !== undefined) {
//   //   product.name = newName;
//   // }
//   // if (newDescription !== undefined) {
//   //   product.description = newDescription;
//   // }
//   // if (newImageUrl !== undefined) {
//   //   product.imageUrl = newImageUrl;
//   // }

//   //função por ser um numero
//   product.price = isNaN(newPrice) ? product.price : newPrice

//   res.status(200).send("Produto atualizado com sucesso")
// })