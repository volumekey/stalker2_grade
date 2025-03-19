import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EvaluationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/getEvaluation?id=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Оценка не найдена');
          }
          return res.json();
        })
        .then((data) => setEvaluation(data))
        .catch((err) => setError(err.message));
    }
  }, [id]);

  if (error) return <div>Ошибка: {error}</div>;
  if (!evaluation) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Оценка</h1>
      <div>
        <h2>Рейтинги</h2>
        {evaluation.ratings.map((rating: any, index: number) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{rating.label}</strong>
            <br />
            Оценка: {rating.value} из {rating.max}
            <br />
            {rating.info && <div>Комментарий: {rating.info}</div>}
          </div>
        ))}
      </div>
      <div>
        <h2>Комментарии</h2>
        {Object.entries(evaluation.content)
          .filter(([key]) => key === 'МИНУСЫ' || key === 'ПЛЮСЫ')
          .map(([key, value]) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <strong>{key}</strong>
              <br />
              <div>{value}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
