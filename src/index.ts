// import {
//   users,
//   products,
//   createUser,
//   getAllUsers,
//   createProduct,
//   getAllProducts,
//   searchProductsByName,
// } from "./database";
import { TProducts, TUsers } from "./types";
import express, { Request, Response, query } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { log } from "console";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

//--------------------------ENDPOINT TEST-----------------
app.get("/ping", (req: Request, res: Response) => {
  res.send("Pooooooooooooooong!");
});

// // console.log("projeto rodando");

// // console.log( users)
// // console.log(products);

// //-------------------------------criando um novo usuario---------------------------
// const creatUserResult: string = createUser(
//   "u003",
//   "Laércio",
//   "laercio@email.com",
//   "laercio123456"
// );

// // console.log(creatUserResult)

// // //imprimindo a lista de usuarios
// const userList = getAllUsers();
// // console.log(userList)

// //------------------------------criando novo produto-----------------------------
// const creatProductResult: string = createProduct(
//   "prod003",
//   "SSD gamer",
//   349.99,
//   "Acelere seu sistema com velocidades incríveis de leitura e gravação.",
//   "https://images.unsplash.com/photo"
// );

// // console.log(creatProductResult)

// const productsList: TProducts[] = getAllProducts();
// // console.log(productsList)

// //------------------------------procurar por nome-------------------------------
// const searchResult: TProducts[] = searchProductsByName("gamer");
// // console.log(searchResult);




//--------------------------USANDO ENDPOINT--------------------
//retorna usuarios cadastrados
app.get("/users", async (req: Request, res: Response) => {
  try {
    const resultUsers = await db.raw(`SELECT * FROM users`);

    res.status(200).send(resultUsers);
  } catch (error) {
    res.send(400);
  }
});

//retorna produtos cadastrados
app.get("/products", async (req: Request, res: Response) => {
  try {
    const resultProducts = await db.raw(`SELECT * FROM products`);
    res.status(200).send(resultProducts);
  } catch (error) {
    res.send(400);
  }
});

//retorna produtos filtrados
app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const query: string = req.query.q as string;

    if (query.length === 0) {
      res.statusCode = 404;
      throw new Error("Query deve possuir pelo menos um caractere");
    }

    const productsByName = await db("products").where(
      "name",
      "like",
      `%${query}%`
    );

    if (productsByName.length === 0) {
      res.statusCode = 404;
      throw new Error(`Nenhum produto encontrado para a query '${query}'`);
    }

    res.status(200).send(productsByName);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro: a query deve possuir pelo menos um caractere");
    }
  }
});

//------------------------criando um novo usuario----------------------

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    if (typeof id !== "string") {
      res.statusCode = 400;
      throw new Error("Id invalido.");
    }

    if (typeof name !== "string") {
      res.statusCode = 400;
      throw new Error("Name invalido.");
    }

    if (typeof email !== "string") {
      res.statusCode = 400;
      throw new Error("Email invalido.");
    }

    if (typeof password !== "string") {
      res.statusCode = 400;
      throw new Error("Password invalido.");
    }

    const [isId] = await db.raw(`SELECT id FROM users WHERE id = "${id}"`);

    if (isId) {
      //NÃO POSSO CADASTRAR
      res.status(400);
      throw new Error("id inválido");
    } else {
      await db.raw(`INSERT INTO users (id, name, email, password)
      VALUES("${id}", "${name}", "${email}", "${password}")`);

      res.status(201).send("Cadastro realizado com sucesso");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

//------------------------criando um novo produto-----------------

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl }: TProducts = req.body;

    if (typeof id !== "string") {
      res.statusCode = 400;
      throw new Error("Id invalido.");
    }

    if (typeof name !== "string") {
      res.statusCode = 400;
      throw new Error("Name invalido.");
    }

    if (typeof price !== "number") {
      res.statusCode = 400;
      throw new Error("price invalido.");
    }

    if (typeof description !== "string") {
      res.statusCode = 400;
      throw new Error("description invalido.");
    }

    if (typeof imageUrl !== "string") {
      res.statusCode = 400;
      throw new Error("imageUrl invalido.");
    }

    const [isIdProduct] = await db.raw(
      `SELECT id FROM products WHERE id = "${id}"`
    );

    if (isIdProduct) {
      //NÃO POSSO CADASTRAR
      res.status(400);
      throw new Error("id inválido");
    } else {
      await db.raw(`INSERT INTO products (id, name, price, description, image_url)
      VALUES("${id}", "${name}", ${price}, "${description}", "${imageUrl}")`);

      res.status(201).send("Produto cadastrado com sucesso");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

//-------------------------excluir usuario------------------

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    const [users] = await db("users").where({ id: idToDelete });
    console.log(users)

    if (!users) {
      res.status(404);
      throw new Error("'id' não encontrada");
    }
    await db("users").del().where({ id: idToDelete });

    res.status(200).send({ message: "User deletado com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Erro inesperado");
    }
  }
});

//-------------------------excluir produtos--------------------

app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const prodId = req.params.id;

    const [product] = await db("product").where({ id: prodId})

    if (!product) {
      res.status(404)
      throw new Error(` Não existe um produto com o id ${prodId}`);
    }

    await db("product").del().where({ id: prodId});

    res.status(200).send({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

//----------------------Editar produtos----------------------

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const newId = req.body.id;
    const newProductName = req.body.name;
    const newPrice = req.body.price;
    const newDescription = req.body.description;
    const newImageUrl = req.body.image;

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }
      if (newId.length < 3) {
        res.status(400);
        throw new Error("'id' deve possuir no mínimo 3 caractere");
      }
    }

    if (newProductName !== undefined) {
      if (typeof newProductName !== "string") {
        res.status(400);
        throw new Error("'Nome do produto' deve ser string");
      }

      if (newProductName.length < 2) {
        res.status(400);
        throw new Error(
          "'Nome do produto' deve possuir no mínimo 2 caracteres"
        );
      }
    }

    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
        res.status(400);
        throw new Error("'Descrição do produto' deve ser uma string");
      }
      if (newDescription.length < 5) {
        res.status(400);
        throw new Error(
          "'Descrição do produto' deve possuir no mínimo 5 caracteres"
        );
      }
    }

    if (newImageUrl !== undefined) {
      if (typeof newImageUrl !== "string") {
        res.status(400);
        throw new Error("'URL do produto' deve ser uma string");
      }
      if (newImageUrl.length < 5) {
        res.status(400);
        throw new Error("'URL do produto' deve possuir no mínimo 5 caracteres");
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
        res.status(400);
        throw new Error("'Preço' deve ser number");
      }

      if (newPrice < 0) {
        res.status(400);
        throw new Error("'Preço' não pode ser negativo");
      }
    }

    const [product] = await db("products").where({ id: id });

    if (product) {
      const updatedProduct = {
        id: newId || product.id,
        name: newProductName || product.name,
        price: isNaN(newPrice) ? product.price : newPrice,
        description: newDescription || product.description,
        image_url: newImageUrl || product.image,
      };
      await db("products").update(updatedProduct).where({ id: id });
    } else {
      res.status(404);
      throw new Error("'id' não encontrada");
    }

    res.status(200).send({ message: "Atualização realizada com sucesso" });
 
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// ----------------------- criar purchase------------------

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, total_price } = req.body;

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
    VALUES("${id}", "${buyer_id}", "${total_price}")`);

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

//----------------------------pegar todas as purchases-------------

app.get("/allpurchase", async (req: Request, res: Response) => {
  try {
   
    const resultPurchases = await db.select("*").from("purchases");
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


//------------------------pegar purchases by id-------------------

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const purchaseId = req.params.id;


    if (!purchaseId) {
      res.statusCode = 404;
      throw new Error(`Pedido com ID ${purchaseId} não encontrado`);
    }

    const [purchaseInfo] = await db("purchases")
      .select(
        "purchases.id as purchaseId",
        "users.id as buyerId",
        "users.name as buyerName",
        "users.email as buyerEmail",
        "purchases.total_price as totalPrice",
        "purchases.created_at as createdAt"
      )
      .innerJoin("users", "purchases.buyer_id", "=", "users.id")
      .where({ "purchases.id": purchaseId });

    const resultProducts = await db("purchases_products")
      .select(
        "id as idProduct",
        "name as nameProduct",
        "price as priceProduct",
        "description as descriptionProduct",
        "image_url as imageUrlProducts",
        "quantity as qtnd"
      )
      .innerJoin(
        "products",
        "purchases_products.product_id",
        "=",
        "products.id"
      )
      .where({ "purchases_products.purchase_id": purchaseId });

    const newResult = {
      ...purchaseInfo,
      products: resultProducts,
    };

    res.status(200).send(newResult);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao buscar informações do pedido");
  }
});


//---------------------excluir purchases------------------


app.delete("/purchases/:id", async (req: Request, res: Response) =>{
  try {

    const idToDelete = req.params.id;

    const [purchase] = await db("purchases").where({ id: idToDelete });

    if (!purchase) {
      res.status(404);
      throw new Error("'id' não encontrada");
    }
    await db("purchases").del().where({ id: idToDelete });

    res.status(200).send({ message: "Pedido  deletado com sucesso" });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Erro inesperado");
    }
  }

});