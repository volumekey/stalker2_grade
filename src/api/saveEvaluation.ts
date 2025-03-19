import { NextApiRequest, NextApiResponse } from 'next';

// Для демонстрации используем глобальную переменную.
// В продакшене рекомендуется использовать базу данных.
if (!globalThis.evaluations) {
  globalThis.evaluations = {};
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Метод не разрешён' });
    return;
  }

  const { ratings, content, timestamp } = req.body;
  if (!ratings || !content) {
    res.status(400).json({ error: 'Отсутствуют необходимые поля' });
    return;
  }

  // Простой способ сгенерировать уникальный ID (на основе времени)
  const id = Date.now().toString();
  globalThis.evaluations[id] = { ratings, content, timestamp };

  res.status(200).json({ id });
}
