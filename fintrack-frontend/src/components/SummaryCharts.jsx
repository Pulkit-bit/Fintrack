import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion, animate } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

function currency(n) {
  if (n == null) return '0';
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function SummaryCharts({ byType, byCategory }) {
  const { isDark } = useTheme();
  const income = Number(byType?.INCOME || 0);
  const expense = Number(byType?.EXPENSE || 0);
  const net = income - expense;

  // 🎯 Animated net value state
  const [displayNet, setDisplayNet] = useState(net);

  useEffect(() => {
    const controls = animate(displayNet, net, {
      duration: 0.6,
      onUpdate: (v) => setDisplayNet(v),
    });
    return () => controls.stop();
  }, [net]);

  // Build pie data from categories with value > 0
  const catLabels = Object.keys(byCategory || {}).filter(
    (k) => (byCategory[k] || 0) > 0
  );
  const catValues = catLabels.map((k) => byCategory[k]);

  const pieData = {
    labels: catLabels,
    datasets: [
      {
        label: 'Expense by Category',
        data: catValues,
        backgroundColor: [
          '#4e79a7',
          '#f28e2b',
          '#e15759',
          '#76b7b2',
          '#59a14f',
          '#edc948',
          '#b07aa1',
          '#ff9da7',
          '#9c755f',
          '#bab0ab',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // let parent box control size
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 8,
          color: isDark ? '#e9ecef' : '#2d3748', // Theme-aware legend color
          font: {
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
            size: 12,
            weight: '600',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = ctx.parsed || 0;
            return `${label}: ₹${currency(value)}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      {/* KPI cards */}
      <div className="row gy-3 mb-4">
        <div className="section-card text-center span-4 span-md-12">
          <div className="text-muted">Income</div>
          <div className="h4 text-success mt-1">₹{currency(income)}</div>
        </div>

        <div className="section-card text-center span-4 span-md-12">
          <div className="text-muted">Expense</div>
          <div className="h4 text-danger mt-1">₹{currency(expense)}</div>
        </div>

        <div className="section-card text-center span-4 span-md-12">
          <div className="text-muted">Net</div>
          <motion.div
            key={net}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`h4 mt-1 ${net < 0 ? 'text-danger' : 'net-blue'}`}
          >
            ₹{currency(displayNet)}
          </motion.div>
        </div>
      </div>

      {/* Centered Pie chart */}
      <div className="section-card">
        <h5 className="card-title mb-3 text-center">Expense by Category</h5>
        <div className="chart-center">
          <div className="chart-box">
            {catValues.length ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div className="text-muted">No expense data yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
