// pages/api/saveEvaluation.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Метод не разрешён' });
      return;
    }

    const { ratings, content, timestamp } = req.body;
    if (!ratings || !content) {
      res.status(400).json({ error: 'Отсутствуют необходимые поля' });
      return;
    }

    // Инициализируем глобальную переменную для хранения оценок (только для демонстрации)
    if (!globalThis.evaluations) {
      globalThis.evaluations = {};
    }

    // Генерируем уникальный ID (на основе времени)
    const id = Date.now().toString();
    globalThis.evaluations[id] = { ratings, content, timestamp };

    res.status(200).json({ id });
  } catch (error) {
    console.error('Ошибка в API-роуте saveEvaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
