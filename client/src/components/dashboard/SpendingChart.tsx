/* ============================================
   SPENDING CHART COMPONENT
   Donut chart showing spending by category.
   Uses Chart.js via react-chartjs-2.
   Handles empty state when no data exists.
   ============================================ */

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import type { CategorySummary } from "../../models/types";
import { CATEGORY_CONFIG } from "../../constants/categories";
import { formatCurrency } from "../../utils/formatters";
import EmptyState from "../common/EmptyState";
import "./SpendingChart.css";

/*
 * Chart.js uses a modular architecture — you must
 * register the components you use. This prevents
 * unused chart types from bloating your bundle.
 */
ChartJS.register(ArcElement, ChartTooltip, Legend);

interface SpendingChartProps {
  data: CategorySummary[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={<ChartEmptyIcon />}
        message="No spending data yet. Your category breakdown will appear once you add expenses."
      />
    );
  }

  const labels = data.map((item) => CATEGORY_CONFIG[item.category].label);
  const values = data.map((item) => item.total);
  const colors = data.map((item) => CATEGORY_CONFIG[item.category].color);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; raw: unknown }) => {
            const value = context.raw as number;
            const item =
              data[context.label ? labels.indexOf(context.label) : 0];
            return ` ${formatCurrency(value)} (${item.percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="spendingChart">
      <div className="spendingChart-container">
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      <div className="spendingChart-legend">
        {data.map((item, index) => (
          <div key={index} className="spendingChart-legendRow">
            <span
              className="spendingChart-dot"
              style={{ background: CATEGORY_CONFIG[item.category].color }}
            />
            <span className="spendingChart-legendLabel">
              {CATEGORY_CONFIG[item.category].label}
            </span>
            <span className="spendingChart-legendValue">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartEmptyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="8"
        width="3"
        height="6"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="7.5"
        y="5"
        width="3"
        height="9"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="13"
        y="2"
        width="3"
        height="12"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
