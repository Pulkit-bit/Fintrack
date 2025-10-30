import { useEffect, useState } from 'react';
import http from '../api/http';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const INITIAL_FORM = {
  amount: '',
  type: 'EXPENSE',
  category: '',
  date: '',
  description: ''
};

export default function TransactionForm({ editing, onSaved, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        id: editing.id,
        amount: editing.amount ?? '',
        type: editing.type ?? 'EXPENSE',
        category: editing.category ?? '',
        date: editing.date ?? '',
        description: editing.description ?? ''
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await http.put(`/api/transactions/${form.id}`, form);
      } else {
        await http.post('/api/transactions', form);
      }
      onSaved?.();
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setForm(INITIAL_FORM);
  };

  return (
    <form className="grid-12" onSubmit={handleSubmit}>
      <div className="span-6 span-md-12">
        <label className="form-label">Type</label>
        <select
          className="form-select"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="EXPENSE">EXPENSE</option>
          <option value="INCOME">INCOME</option>
        </select>
      </div>

      <div className="span-6 span-md-12">
        <label className="form-label">Category</label>
        <input
          className="form-control"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="span-4 span-md-12">
        <label className="form-label">Amount</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </div>

     <div className="span-4 span-md-12" style={{ width: '100%' }}>
       <label className="form-label" htmlFor="date-input">Date</label>
       <DatePicker
         id="date-input"
         selected={form.date ? new Date(form.date) : null}
         onChange={(date) =>
           setForm(f => ({
             ...f,
             date: date ? date.toISOString().slice(0, 10) : ''
           }))
         }
         dateFormat="dd-MM-yyyy"
         name="date"
         required
         data-testid="transaction-date"
         placeholderText="Select date"
         customInput={
           <input
             type="text"
             className="form-control"
             style={{ width: '100%' }}
             required
           />
         }
         // This style forces the DatePicker's container to full width too
         wrapperClassName="full-width-datepicker"
       />
     </div>


      <div className="span-4 span-md-12">
        <label className="form-label">Description</label>
        <input
          className="form-control"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="span-12" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {form.id ? 'Update' : 'Add'} Transaction
        </button>
        {form.id && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
