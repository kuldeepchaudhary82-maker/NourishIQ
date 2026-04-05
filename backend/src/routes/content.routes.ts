import { Router } from 'express';

const router = Router();

router.get('/tips', (req, res) => {
  res.json({ message: 'Content route working' });
});

export default router;
