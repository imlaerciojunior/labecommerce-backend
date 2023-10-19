-- Active: 1697666064661@@127.0.0.1@3306


-- TABELA DE USUARIOS
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
);

-- SELECIONA TODOS OS USUARIOS
SELECT *FROM users;

-- EXCLUI A TABELA DOS USUARIOS
DROP TABLE users;

-- INSERIR OS NOVOS USUARIOS
INSERT INTO users (id, name, email, password) VALUES
('u001', 'Bruno', 'bruno@email.com', 'bruno123'),
('u002', 'Biju', 'biju@email.com', 'biju123'),
('u003', 'Shoyo', 'shoyo@email.com', 'shoyo123'),
('u004', 'Marina', 'marina@email.com', 'marina123');

-- TABELA DE PRODUTOS
CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- SELECIONA TODOS OS PRODUTOS
SELECT *FROM products;

-- EXCLUI TABELA DE PRODUTOS
DROP TABLE products;

-- INSERE NOVOS PRODUTOS
INSERT INTO products (id, name, price, description, image_url) VALUES
('prod001', 'robo aspirador', 1234.00, 'Robô Aspirador de Pó KaBuM! ', 'https://images.kabum.com.br/produtos.jpg'),
('prod002', 'placa de video gamer', 1800.00, 'Placa de Vídeo MSI NVIDIA GeForce ', 'https://images.kabum.com.br/produtos2.jpg'),
('prod003', 'playstation 5', 3500.00, 'Console Sony Playstation 5, Edição Digital', 'https://images.kabum.com.br/produtos3.jpg'),
('prod004', 'Macbook Pro Apple 16', 12034.00, 'macbook pro de 16 polegadas', 'https://images.kabum.com.br/produtos4.jpg'),
('prod005', 'Samsung Galaxy Z Flip5', 6234.00, 'Smartphone Samsung Galaxy Z Flip5', 'https://images.kabum.com.br/produtos5.jpg'),
('prod006', 'XBOX 360 one', 2600.00, 'Espaço de armazenamento: 512 Gb', 'https://images.kabum.com.br/produtos6.jpg');

-- BUSCA POR NOME GAME DOS PRODUTOS
SELECT * FROM products
WHERE name LIKE '%gamer%';


-- DELETAR USER BY ID
DELETE FROM users
WHERE id = 'u003';

-- DELETAR PRODUCT BY ID
DELETE FROM products
WHERE id = 'prod006';

-- EDITAR PRODUCT BY ID
UPDATE products
SET 
  name = 'xxxxxxxxxxxxx',
  price = 699.79,
  description = 'Descrição do Produto 7',
  image_url = 'novaimagemurl.jpg'
WHERE id = 'prod005';


-- TABELA DE PEDIDOS

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    total_price REAL NOT NULL,
    product_id TEXT, -- Adicionando a coluna product_id
    product_description TEXT,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE -- efeito cascata ao atualizar id na tabela users
		ON DELETE CASCADE -- efeito cascata ao atualizar id na tabela users
);

DROP TABLE purchases;

-- INTRODUZIR PEDIDO
INSERT INTO purchases (id, buyer_id, total_price, product_id, product_description)
VALUES
('p001', 'u001', 100,'prod003', 'Robô Aspirador de Pó KaBuM!'),
('p002', 'u003', 300, 'prod003','Robô Aspirador de Pó KaBuM!'),
('p003', 'u004', 110, 'prod003', 'Robô Aspirador de Pó KaBuM!'),
('p004', 'u002', 200,'prod003', 'Robô Aspirador de Pó KaBuM!');

SELECT * FROM purchases;

-- EDITAR PEDIDO
UPDATE purchases
SET total_price = 700 WHERE buyer_id = 'u003'

-- JUNÇÃO DAS TABELAS

SELECT purchases.id AS idCompra, users.id AS idUser, users.name, users.email, purchases.total_price, purchases.created_at FROM purchases
INNER JOIN users ON users.id = purchases.buyer_id;

-- CRIANDO TABELA DE RELAÇÕES 

CREATE TABLE purchases_products (
  purchase_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
  ON UPDATE CASCADE -- efeito cascata ao atualizar id na tabela users
	ON DELETE CASCADE -- efeito cascata ao atualizar id na tabela users
);

INSERT INTO purchases_products VALUES
('p001', 'prod003', 1),
('p001', 'prod005', 1 ),
('p002', 'prod006', 2);

SELECT *
FROM purchases_products
INNER JOIN purchases ON purchases_products.purchase_id = purchases.id
INNER JOIN products ON purchases_products.product_id = products.id;
