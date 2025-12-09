import { useState, useEffect } from 'react';

export default function DateFilter({ onChange, currentFilter }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Initialize from currentFilter prop if provided, otherwise use defaults
  const getInitialFilterType = () => {
    if (!currentFilter) return 'month';
    if (currentFilter.year === null) return 'all';
    if (currentFilter.month === null) return 'year';
    return 'month';
  };

  const [filterType, setFilterType] = useState(getInitialFilterType());
  const [selectedYear, setSelectedYear] = useState(currentFilter?.year || currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentFilter?.month || currentMonth);

  // Generate year options (last 5 years + current + next)
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i);
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Sync local state with currentFilter prop when it changes externally
  useEffect(() => {
    if (currentFilter) {
      if (currentFilter.year === null) {
        setFilterType('all');
      } else if (currentFilter.month === null) {
        setFilterType('year');
        setSelectedYear(currentFilter.year);
      } else {
        setFilterType('month');
        setSelectedYear(currentFilter.year);
        setSelectedMonth(currentFilter.month);
      }
    }
  }, [currentFilter]);

  useEffect(() => {
    // Notify parent of filter changes
    if (filterType === 'all') {
      onChange({ year: null, month: null });
    } else if (filterType === 'year') {
      onChange({ year: selectedYear, month: null });
    } else if (filterType === 'month') {
      onChange({ year: selectedYear, month: selectedMonth });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, selectedYear, selectedMonth]);

  return (
    <div className="date-filter">
      <div className="filter-controls">
        {/* Filter Type Selector */}
        <div className="filter-group">
          <label className="filter-label">View:</label>
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">Yearly</option>
            <option value="month">Monthly</option>
          </select>
        </div>

        {/* Year Selector */}
        {(filterType === 'year' || filterType === 'month') && (
          <div className="filter-group">
            <label className="filter-label">Year:</label>
            <select
              className="filter-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Month Selector */}
        {filterType === 'month' && (
          <div className="filter-group">
            <label className="filter-label">Month:</label>
            <select
              className="filter-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
