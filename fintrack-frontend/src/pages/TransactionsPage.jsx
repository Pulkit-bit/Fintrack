import { useRef, useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

export default function TransactionsPage() {
const [editing, setEditing] = useState(null);
const [reloadFlag, setReloadFlag] = useState(0);

const handleSaved = () => {
setEditing(null);
setReloadFlag((x) => x + 1);
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
      <h4 className="mb-3 text-lg font-medium">All Transactions</h4>
      <TransactionTable
        key={reloadFlag}
        onEditRequested={setEditing}
      />
    </div>
  </div>
 );
}
