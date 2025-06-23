// chartConfig.js
import {
  Chart,
  LineElement,
  BarElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
} from 'chart.js';

let isRegistered = false;

export const registerCharts = () => {
  if (!isRegistered) {
    Chart.register(
      LineElement,
      PointElement,
      LineController,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
      ArcElement,
      DoughnutController
    );
    isRegistered = true;
  }
};
