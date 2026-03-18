/* ============================================
   TRANSACTION CHART COMPONENT
   Bar or line chart showing daily spending/income.
   Toggleable between chart types and data views.
   Uses Chart.js.
   ============================================ */

import { useState, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { type Transaction } from "../../models/types";
import "./TransactionChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface TransactionChartProps {
  transactions: Transaction[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
}

type ChartMode = "bar" | "line";
type DataView = "expenses" | "income" | "both";

export default function TransactionChart({
  transactions,
  selectedMonth,
  onMonthChange,
  availableMonths,
}: TransactionChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>("bar");
  const [dataView, setDataView] = useState<DataView>("expenses");

  const dailyData = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const expenseByDay: number[] = new Array(daysInMonth).fill(0);
    const incomeByDay: number[] = new Array(daysInMonth).fill(0);

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (date.getFullYear() === year && date.getMonth() === month - 1) {
        const day = date.getDate() - 1;
        if (t.type === "expense") {
          expenseByDay[day] += t.amount;
        } else if (t.type === "income") {
          incomeByDay[day] += t.amount;
        }
      }
    });

    return {
      labels: Array.from({ length: daysInMonth }, (_, i) => String(i + 1)),
      expenseByDay: expenseByDay.map((v) => v / 100),
      incomeByDay: incomeByDay.map((v) => v / 100),
    };
  }, [transactions, selectedMonth]);

  const datasets = [];

  if (dataView === "expenses" || dataView === "both") {
    datasets.push({
      label: "Expenses",
      data: dailyData.expenseByDay,
      backgroundColor: "rgba(226, 75, 74, 0.7)",
      borderColor: "#E24B4A",
      borderWidth: chartMode === "line" ? 2 : 0,
      borderRadius: chartMode === "bar" ? 3 : 0,
      fill: chartMode === "line",
      tension: 0.3,
      pointRadius: chartMode === "line" ? 0 : undefined,
      pointHoverRadius: chartMode === "line" ? 4 : undefined,
    });
  }

  if (dataView === "income" || dataView === "both") {
    datasets.push({
      label: "Income",
      data: dailyData.incomeByDay,
      backgroundColor: "rgba(46, 204, 113, 0.7)",
      borderColor: "#2ecc71",
      borderWidth: chartMode === "line" ? 2 : 0,
      borderRadius: chartMode === "bar" ? 3 : 0,
      fill: chartMode === "line",
      tension: 0.3,
      pointRadius: chartMode === "line" ? 0 : undefined,
      pointHoverRadius: chartMode === "line" ? 4 : undefined,
    });
  }

  const chartData = {
    labels: dailyData.labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; raw: unknown }) => {
            const val = context.raw as number;
            return ` ${context.dataset.label}: $${val.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          color: "var(--color-text-tertiary)",
          maxTicksLimit: 15,
        },
      },
      y: {
        grid: { color: "rgba(128,128,128,0.1)" },
        ticks: {
          font: { size: 10 },
          color: "var(--color-text-tertiary)",
          callback: (value: number | string) => `$${value}`,
        },
        beginAtZero: true,
      },
    },
  } as const;

  return (
    <div className="txChart">
      <div className="txChart-top">
        <div className="txChart-title">Spending overview</div>
        <div className="txChart-controls">
          <div className="txChart-toggleGrp">
            <button
              className={`txChart-toggleBtn ${dataView === "expenses" ? "active" : ""}`}
              onClick={() => setDataView("expenses")}
            >
              Expenses
            </button>
            <button
              className={`txChart-toggleBtn ${dataView === "income" ? "active" : ""}`}
              onClick={() => setDataView("income")}
            >
              Income
            </button>
            <button
              className={`txChart-toggleBtn ${dataView === "both" ? "active" : ""}`}
              onClick={() => setDataView("both")}
            >
              Both
            </button>
          </div>
          <select
            className="txChart-monthSel"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            {availableMonths.map((m) => {
              const [y, mo] = m.split("-");
              const d = new Date(Number(y), Number(mo) - 1);
              return (
                <option key={m} value={m}>
                  {d.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              );
            })}
          </select>
          <div className="txChart-toggleGrp">
            <button
              className={`txChart-toggleBtn ${chartMode === "bar" ? "active" : ""}`}
              onClick={() => setChartMode("bar")}
            >
              Bar
            </button>
            <button
              className={`txChart-toggleBtn ${chartMode === "line" ? "active" : ""}`}
              onClick={() => setChartMode("line")}
            >
              Line
            </button>
          </div>
        </div>
      </div>
      <div className="txChart-canvas">
        {chartMode === "bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
