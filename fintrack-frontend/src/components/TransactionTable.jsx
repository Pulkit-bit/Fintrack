import { useEffect, useState } from 'react';
import http from '../api/http';

export default function TransactionTable({ onEditRequested }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await http.get('/api/transactions');
      let data = res.data || [];

     /*
     // ✅ Sort transactions by date (ascending order)
      // and ensure INCOME appears before EXPENSE on the same date
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          // ✅ Same date → put INCOME first
          if (a.type === 'INCOME' && b.type !== 'INCOME') return -1;
          if (b.type === 'INCOME' && a.type !== 'INCOME') return 1;
          return 0;
        }
        return dateA - dateB; // ascending order by default
      });
        */

      //  ✅ If you ever want DESCENDING order (newest → oldest),
      //  just comment out the above sorting logic and uncomment below:

      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
       /*  if (dateA.getTime() === dateB.getTime()) {
          // INCOME still appears before EXPENSE
          if (a.type === 'INCOME' && b.type !== 'INCOME') return -1;
          if (b.type === 'INCOME' && a.type !== 'INCOME') return 1;
          return 0;
        } */
        return dateB - dateA; // descending order
      });


      setItems(sortedData);
    } catch (e) {
      console.error(e);
      alert('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await http.delete('/api/transactions/' + id);
      await load();
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  if (loading) return <div className="mt-3">Loading...</div>;
  if (!items.length) return <div className="mt-3 text-muted">No transactions yet.</div>;

  // ✅ Format date: "01 Oct 2025"
  const formatDate = (d) => {
    if (!d) return '';
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="table-wrap mt-3 table-wrap-rounded">
      <table className="table align-middle table-rounded">
        <thead>
          <tr>
            <th style={{ width: 24 }}></th>
            <th>Type</th>
            <th>Category</th>
            <th className="text-end">Amount</th>
            <th>Date</th>
            <th style={{ width: '40%' }}>Description</th>
            <th style={{ width: 160 }} className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t, idx) => (
            <tr key={t.id ?? (t.category ? t.category + '-' + idx : 'row-' + idx)}>
              <td className="text-center">- </td>
              <td>{t.type}</td>
              <td className="category-col">
                <span className="category-text">{t.category}</span>
              </td>
              <td className="text-end">{t.amount}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
              <td className="desc-col">{t.description}</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEditRequested?.(t)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

