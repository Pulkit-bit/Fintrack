import { useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import DateFilter from '../components/DateFilter';
import { useFilter } from '../contexts/FilterContext';

export default function TransactionsPage() {
  const [editing, setEditing] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const { filterParams, setFilterParams } = useFilter();

  const handleSaved = () => {
    setEditing(null);
    setReloadFlag((x) => x + 1);
  };

  const handleFilterChange = (params) => {
    setFilterParams(params);
  };

  return (
    <div className="page-wrap min-h-screen px-6 py-4">
      <h2 className="page-title mb-4 text-xl font-semibold">Transactions</h2>

      {/* Entry form section */}
      <div className="section-card mb-4">
        <TransactionForm
          editing={editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      </div>

      {/* Table section */}
      <div className="section-card">
        <div className="mb-3 d-flex justify-content-between align-items-center transactions-header">
          <h4 className="text-lg font-medium mb-0">All Transactions</h4>
          <DateFilter onChange={handleFilterChange} currentFilter={filterParams} />
        </div>
        <TransactionTable
          key={reloadFlag}
          onEditRequested={setEditing}
          filterParams={filterParams}
        />
      </div>
    </div>
  );
}
