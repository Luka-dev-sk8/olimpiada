CREATE TABLE Clientes (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    contraseña NVARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE()
);

CREATE TABLE Productos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    codigo_producto NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(255) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Carrito (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    cliente_id BIGINT FOREIGN KEY REFERENCES Clientes(id),
    producto_id BIGINT FOREIGN KEY REFERENCES Productos(id),
    cantidad INT NOT NULL,
    estado NVARCHAR(50) NOT NULL
);

CREATE TABLE Pedidos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    cliente_id BIGINT FOREIGN KEY REFERENCES Clientes(id),
    fecha_pedido DATETIME DEFAULT GETDATE(),
    estado NVARCHAR(50) NOT NULL
);

CREATE TABLE DetallePedido (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    pedido_id BIGINT FOREIGN KEY REFERENCES Pedidos(id),
    producto_id BIGINT FOREIGN KEY REFERENCES Productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Ventas (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    pedido_id BIGINT FOREIGN KEY REFERENCES Pedidos(id),
    total DECIMAL(10, 2) NOT NULL,
    fecha_venta DATETIME DEFAULT GETDATE()
);

CREATE TABLE HistorialPedidos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    pedido_id BIGINT FOREIGN KEY REFERENCES Pedidos(id),
    fecha_entrega DATETIME NOT NULL
);

CREATE TABLE Correos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    pedido_id BIGINT FOREIGN KEY REFERENCES Pedidos(id),
    email_cliente NVARCHAR(255) NOT NULL,
    email_empresa NVARCHAR(255) NOT NULL,
    fecha_envio DATETIME DEFAULT GETDATE()
);


select * from Clientes