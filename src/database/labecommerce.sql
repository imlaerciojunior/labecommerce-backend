-- Active: 1695690091017@@127.0.0.1@1433

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL 
);

SELECT *FROM users;

DROP TABLE users;

INSERT INTO users (id, name, email, password, created_at)
VALUES('u003', 'Shoyo', 'shoyo@email.com', 'whiscassache', strftime('%Y-%m-%dT%H:%M:%S', 'now'))

INSERT INTO users (id, name, email, password, created_at)
VALUES('u004', 'Biju', 'biju@email.com', 'boladepelo', strftime('%Y-%m-%dT%H:%M:%S', 'now'))

INSERT INTO users (id, name, email, password, created_at)
VALUES('u005', 'Bruno', 'bruno@email.com', 'meumaridolindo', strftime('%Y-%m-%dT%H:%M:%S', 'now'))


CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

SELECT *FROM products;

DROP TABLE products;

INSERT INTO products (id, name, price, description, image_url)
VALUES('prod003', 'robo aspirador', 1234.00, 'Robô Aspirador de Pó KaBuM! Smart 700, Mapeamento IR 360º, Controle via Aplicativo, Google Assistant e Alexa', 'https://images.kabum.com.br/produtos/fotos/155444/aspirador-de-po-robo-ir-360-kabum-smart-700-preto_1628768893_m.jpg')

INSERT INTO products (id, name, price, description, image_url)
VALUES('prod004', 'placa de video', 1800.00, 'Placa de Vídeo MSI NVIDIA GeForce RTX 3060 Ventus', 'https://images7.kabum.com.br/produtos/fotos/384627/placa-de-video-msi-nvidia-geforce-rtx-3060-ventus-2x-12gb-gddr6-dlss-ray-tracing-912-v397-272_1663850312_m.jpg')

INSERT INTO products (id, name, price, description, image_url)
VALUES('prod005', 'playstation 5', 3500.00, 'Console Sony Playstation 5, Edição Digital', 'https://images.kabum.com.br/produtos/fotos/238670/console-sony-playstation-5-edicao-digital_1634132113_m.jpg')

INSERT INTO products (id, name, price, description, image_url)
VALUES('prod006', 'Macbook Pro Apple 16', 12034.00, 'macbook pro de 16 polegadas', 'https://images2.kabum.com.br/produtos/fotos/sync_mirakl/479192/Macbook-Pro-Apple-16-Chip-M1-Max-32GB-SSD-1TB-Cinza-Espacial-Mk1a3bz-A_1694541516_m.jpg')

INSERT INTO products (id, name, price, description, image_url)
VALUES('prod007', 'Samsung Galaxy Z Flip5', 6234.00, 'Smartphone Samsung Galaxy Z Flip5 512gb 5g Tela Dobrável 6.7 Câmera Dupla 12mp Câmera Selfie 10mp Dual Chip Android 13, Grafite', 'https://images.kabum.com.br/produtos/fotos/magalu/480251/Smartphone-Samsung-Z-Flip-5-512GB-Grafite-5G-Snapdragon-8GB-RAM-6-7-C-m-Dupla-Selfie-10MP-Dual-Chip_1692195175_m.jpg')


