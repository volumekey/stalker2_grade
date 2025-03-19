import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: 'Отсутствует параметр id' });
    return;
  }

  const evaluation = globalThis.evaluations && globalThis.evaluations[id as string];
  if (!evaluation) {
    res.status(404).json({ error: 'Оценка не найдена' });
    return;
  }

  res.status(200).json(evaluation);
}
