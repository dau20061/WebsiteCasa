import { Router } from 'express';
import { getUsers, saveUser, deleteUser } from '../services/dbService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const list = await getUsers();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const saved = await saveUser(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:uid', async (req, res) => {
  try {
    const result = await deleteUser(req.params.uid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
