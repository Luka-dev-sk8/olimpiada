CREATE TABLE Clientes (
    customer_id BIGINT PRIMARY KEY IDENTITY(1,1),  -- identificador
    nombre NVARCHAR(50) NOT NULL UNIQUE,  --nombre elegido por el usuario
	contraseña NVARCHAR(255) NOT NULL,  --contraseña designada por el usuario
    email NVARCHAR(255) NOT NULL UNIQUE, --email de contacto o envio de comprobantes
);

CREATE TABLE Paquetes (
    package_id BIGINT PRIMARY KEY IDENTITY(1,1),
    package_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Pedidos (
    order_id BIGINT PRIMARY KEY IDENTITY(1,1),
    customer_id BIGINT NOT NULL FOREIGN KEY REFERENCES Clientes(customer_id),
    order_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status NVARCHAR(50) NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed'))
);

CREATE TABLE Detalles_Pedido (
    order_item_id BIGINT PRIMARY KEY IDENTITY(1,1),
    order_id BIGINT NOT NULL FOREIGN KEY REFERENCES Pedidos(order_id),
    package_id BIGINT NOT NULL FOREIGN KEY REFERENCES Paquetes(package_id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Pedidos_Entregados (
    delivered_order_id BIGINT PRIMARY KEY IDENTITY(1,1),
    original_order_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL FOREIGN KEY REFERENCES Clientes(customer_id),
    order_date DATETIME NOT NULL,
    delivered_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Ventas (
    sale_id BIGINT PRIMARY KEY IDENTITY(1,1),
    delivered_order_id BIGINT NOT NULL FOREIGN KEY REFERENCES Pedidos_Entregados(delivered_order_id),
    package_id BIGINT NOT NULL FOREIGN KEY REFERENCES Paquetes(package_id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_date DATETIME DEFAULT GETDATE()
);

CREATE TABLE Pagos (
    payment_id BIGINT PRIMARY KEY IDENTITY(1,1),
    order_id BIGINT NOT NULL FOREIGN KEY REFERENCES Pedidos(order_id),
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method NVARCHAR(50),
    transaction_id NVARCHAR(255)
);


select * from Clientes


