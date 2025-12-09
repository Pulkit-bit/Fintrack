import { useEffect, useState } from 'react';
import http from '../api/http';
import SummaryCharts from '../components/SummaryCharts';
import { useFilter } from '../contexts/FilterContext';

export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [byType, setByType] = useState({});
  const [byCategory, setByCategory] = useState({});
  const { filterParams } = useFilter();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Build query params
        const params = {};
        if (filterParams?.year) params.year = filterParams.year;
        if (filterParams?.month) params.month = filterParams.month;
        
        const [typeRes, catRes] = await Promise.all([
          http.get('/api/transactions/summary/type', { params }),
          http.get('/api/transactions/summary/category', { params }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams?.year, filterParams?.month]);

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
