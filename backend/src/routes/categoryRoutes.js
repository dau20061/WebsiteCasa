import { Router } from 'express';
import { getCategories, getCategoryById, saveCategory, deleteCategory } from '../services/dbService.js';

const router = Router();

// GET /api/categories - Lấy toàn bộ danh mục sản phẩm
router.get('/', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories/:id - Lấy chi tiết một danh mục
router.get('/:id', async (req, res) => {
  try {
    const cat = await getCategoryById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories - Tạo mới danh mục
router.post('/', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
    }
    const saved = await saveCategory(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categories/:id - Cập nhật danh mục
router.put('/:id', async (req, res) => {
  try {
    const saved = await saveCategory({ ...req.body, id: req.params.id });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categories/:id - Xóa danh mục
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCategory(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

