import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const MyDoughnutChart = ({rating}) => {
  console.log('rating is: ' , rating/5*100)
  let percentage = rating/5 * 100
  const data = {
    labels: [],
    datasets: [{
      label: 'Αξιολογήσεις',
      data: [percentage, 100-percentage],
      backgroundColor: [
        'rgb(64, 224, 208)',
        'rgb(255, 255, 255)',
      ],
      hoverOffset: 4,
      borderColor: 'Black'
    }]
  }

  const options = {
    plugins: {
      tooltip: {
        enabled: false
      }
    }
  }

  return <Doughnut data={data} options={options} />
}

export default MyDoughnutChart