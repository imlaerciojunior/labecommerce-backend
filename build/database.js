"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = exports.users = void 0;
exports.users = [
    {
        id: "u001",
        name: "Bruno",
        email: "bruno@email.com",
        password: "bruno123456",
        createdAt: new Date().toISOString(),
    },
    {
        id: "u002",
        name: "Marina",
        email: "marina@email.com",
        password: "girafa123456",
        createdAt: new Date().toISOString(),
    },
    {
        id: "u003",
        name: "Junior",
        email: "junior@email.com",
        password: "junior123456",
        createdAt: new Date().toISOString(),
    },
];
exports.products = [
    {
        id: "prod001",
        name: "Mouse gamer",
        price: 250,
        description: "Melhor mouse do mercado!",
        imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
    },
    {
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400",
    },
];
//# sourceMappingURL=database.js.map