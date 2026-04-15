const express = require('express');
const cors = require('cors');

const app = express();

// Middleware log request
app.use((req, _, next) => {
  console.log(req.method, req.url);
  next();
});

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

// Route gốc (FIX lỗi Cannot GET /)
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Fake DB
let products = [
  { id: 1, name: 'Áo thun basic', price: 150000 },
  { id: 2, name: 'Quần jeans slim', price: 450000 },
];

// GET
app.get('/api/products', (req, res) => {
  res.json(products);
});

// POST
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Thiếu dữ liệu' });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price: Number(price)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  }

  products.splice(index, 1);

  res.json({ message: 'Đã xoá thành công' });
});

// START SERVER
app.listen(5000, () => {
  console.log('Backend chạy tại http://localhost:5000');
});