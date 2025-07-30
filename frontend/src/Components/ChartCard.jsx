import { Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

const ChartCard = ({ title, chartType }) => {
  const doughnutData = {
    labels: ['LGBTQI+', 'Refugees', 'Youth', 'PWD', 'Women'],
    datasets: [
      {
        data: [25, 20, 30, 10, 15],
        backgroundColor: ['#a78bfa', '#7c3aed', '#c084fc', '#d946ef', '#f0abfc'],
        borderWidth: 1,
      },
    ],
  }

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Beneficiaries',
        data: [200, 400, 450, 600, 700, 850],
        fill: false,
        borderColor: '#7c3aed',
        tension: 0.3,
      },
    ],
  }

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {chartType === 'doughnut' && <Doughnut data={doughnutData} />}
      {chartType === 'line' && <Line data={lineData} />}
    </div>
  )
}

export default ChartCard