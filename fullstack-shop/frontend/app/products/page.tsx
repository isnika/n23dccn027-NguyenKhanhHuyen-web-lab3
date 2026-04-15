'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // FETCH
  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch {
      toast.error('Lỗi tải sản phẩm!');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !price) {
      return toast.error('Nhập đầy đủ thông tin!');
    }

    try {
      await toast.promise(
        api.post('/api/products', { name, price }),
        {
          loading: 'Đang thêm...',
          success: 'Thêm thành công!',
          error: 'Thêm thất bại!',
        }
      );

      setName('');
      setPrice('');
      fetchProducts();
    } catch {}
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xoá?')) return;

    const oldProducts = products;

    // Optimistic update
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Đã xoá');
    } catch {
      toast.error('Xoá thất bại!');
      setProducts(oldProducts); // rollback
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Quản lý sản phẩm</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên sản phẩm"
          className="border p-2 flex-1"
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Giá"
          type="number"
          className="border p-2 w-32"
        />
        <button className="bg-blue-500 text-white px-4">
          Thêm
        </button>
      </form>

      {/* LIST */}
      {products.map(p => (
        <div
          key={p.id}
          className="flex justify-between items-center p-3 border mb-2 rounded"
        >
          <span>
            {p.name} — {p.price.toLocaleString()}đ
          </span>

          <button
            onClick={() => handleDelete(p.id)}
            className="text-red-500 hover:text-red-700"
          >
            Xoá
          </button>
        </div>
      ))}
    </div>
  );
}