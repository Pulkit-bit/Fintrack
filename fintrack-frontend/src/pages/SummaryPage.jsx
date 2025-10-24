import { useEffect, useState } from 'react';
import http from '../api/http';
import SummaryCharts from '../components/SummaryCharts';

export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [byType, setByType] = useState({});
  const [byCategory, setByCategory] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [typeRes, catRes] = await Promise.all([
          http.get('/api/transactions/summary/type'),
          http.get('/api/transactions/summary/category'),
        ]);
        setByType(typeRes.data || {});
        setByCategory(catRes.data || {});
      } catch (e) {
        console.error(e);
        alert('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-wrap summary-wrap">
      <div className="section-card">
        <h2 className="page-title mb-4 text-center">Summary</h2>

        {loading ? (
          <div className="text-muted text-center">Loading...</div>
        ) : (
          <div className="center" >
            <div className="chart-card" >
              <SummaryCharts byType={byType} byCategory={byCategory} />
            </div>
          </div>

        )}
      </div>
    </div>
  );
}
