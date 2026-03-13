# NubePilot API Documentation

NubePilot es un backend de commerce intelligence que se integra con la API de Tiendanube para analizar datos de tiendas y ayudar a comerciantes a mejorar sus ventas.

## Base URL

```
http://localhost:3000
```

## Endpoints

### 1. Health Check

```http
GET /
```

Respuesta:
```json
{
  "message": "NubePilot API",
  "version": "1.0.0"
}
```

---

### 2. Eventos de Vistas de Productos

Registra cuando un usuario visita un producto.

```http
POST /api/events/product-view
```

Body:
```json
{
  "store_id": 7390235,
  "product_id": 987654,
  "product_name": "Sombrero Andino",
  "timestamp": "2026-03-12T18:42:15.321Z",
  "url": "https://store.com/product"
}
```

El campo `timestamp` es opcional. Si no se envía, se genera automáticamente.

---

### 3. Analytics - Vistas por Producto

Obtiene las vistas agrupadas por producto.

```http
GET /api/analytics/product-views
```

Respuesta:
```json
[
  {
    "product_id": 987654,
    "product_name": "Sombrero Andino",
    "views": 25
  }
]
```

---

### 4. Analytics - Métricas de Productos

Guarda métricas de un producto (visitas, compras).

```http
POST /api/analytics/product-metrics
```

Body:
```json
{
  "product_id": 330506716,
  "views": 150,
  "purchases": 12
}
```

Obtiene todas las métricas guardadas:

```http
GET /api/analytics/product-metrics
```

---

### 5. Recomendaciones de Descuentos

Analiza las métricas y genera recomendaciones de descuentos cuando las compras superan las vistas por 100 o más puntos.

```http
GET /api/analytics/discount-recommendations
```

Respuesta:
```json
[
  {
    "product_id": 330506718,
    "message": "Te recomendamos que hagas un descuento por el 10% del precio"
  }
]
```

---

### 6. Aplicar Descuento a Producto

Aplica un descuento a un producto (actualiza el variant con precio promocional).

```http
POST /api/analytics/apply-discount
```

Body:
```json
{
  "product_id": 330506716,
  "discount_percentage": 10
}
```

Respuesta:
```json
{
  "message": "Descuento del 10% aplicado",
  "original_price": "100.00",
  "new_price": "90.00",
  "variant": { ... }
}
```

---

### 7. Productos (Tiendanube)

Obtiene todos los productos de la tienda:

```http
GET /api/tiendanube/products
```

Obtiene un producto específico:

```http
GET /api/tiendanube/products/:id
```

---

### 8. Categorías (Tiendanube)

Obtiene todas las categorías:

```http
GET /api/tiendanube/categories
```

Obtiene una categoría específica:

```http
GET /api/tiendanube/categories/:id
```

---

### 9. Cupones (Tiendanube)

#### Crear cupón

```http
POST /api/tiendanube/coupons
```

Body:
```json
{
  "code": "BIENVENIDA15",
  "type": "percentage",
  "value": "15.00",
  "min_price_threshold": "0.00",
  "max_uses": 100
}
```

#### Listar cupones

```http
GET /api/tiedenube/coupons
```

#### Obtener cupón por ID

```http
GET /api/tiendanube/coupons/:id
```

#### Actualizar cupón

```http
PUT /api/tiendanube/coupons/:id
```

#### Eliminar cupón

```http
DELETE /api/tiendenube/coupons/:id
```

---

### 10. Pedidos (Tiendanube)

#### Listar pedidos

```http
GET /api/tiendanube/orders
```

#### Obtener pedido por ID

```http
GET /api/tiendanube/orders/:id
```

#### Crear pedido

```http
POST /api/tiendanube/orders
```

#### Actualizar pedido

```http
PUT /api/tiendanube/orders/:id
```

#### Eliminar pedido

```http
DELETE /api/tiendanube/orders/:id
```

---

### 11. Descuentos (Tiendanube)

> Nota: Este endpoint puede devolver 404 dependiendo de la configuración de la tienda.

```http
GET /api/tiendanube/discounts
POST /api/tiendanube/discounts
GET /api/tiendanube/discounts/:id
PUT /api/tiendanube/discounts/:id
DELETE /api/tiendanube/discounts/:id
```

---

## Configuración

Las credenciales de Tiendanube se encuentran en:

```
src/config/constants.js
```

Parámetros:
- `STORE_ID`: ID de la tienda
- `ACCESS_TOKEN`: Token de acceso a la API
- `USER-Agent`: Identificador de la aplicación

---

## future Extensions

- Integración con IA para recomendaciones personalizadas
- Generación automática de cupones
- Almacenamiento en base de datos
- Dashboard de analytics
