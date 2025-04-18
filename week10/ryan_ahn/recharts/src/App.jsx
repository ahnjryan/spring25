import React, { useState } from 'react';
import './App.css';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

// Sample data for each chart
const dataLine = [
  { name: 'Page A', uv: 400, pv: 2400 },
  { name: 'Page B', uv: 300, pv: 1398 },
  { name: 'Page C', uv: 200, pv: 9800 },
  { name: 'Page D', uv: 278, pv: 3908 },
  { name: 'Page E', uv: 189, pv: 4800 }
];

const dataBar = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 200 },
  { name: 'May', users: 278 }
];

const dataPie = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Custom axis tick from original example
const renderCustomAxisTick = ({ x, y, payload }) => {
  let path = '';

  switch (payload.value) {
    case 'Page A':
      path = 'M899.072 99.328q9.216 ...';
      break;
    case 'Page B':
      path = 'M662.528 451.584q10.24 ...';
      break;
    default:
      path = '';
  }

  return (
    <svg x={x - 12} y={y + 4} width={24} height={24} viewBox="0 0 1024 1024" fill="#666">
      <path d={path} />
    </svg>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recharts Examples</h1>
      </header>
      <div className="charts-container">
        {/* Line Chart */}
        <div className="chart-wrapper">
          <h2>Line Chart</h2>
          <LineChart width={600} height={300} data={dataLine} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" tick={renderCustomAxisTick} />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        {/* Bar Chart */}
        <div className="chart-wrapper">
          <h2>Bar Chart</h2>
          <BarChart width={600} height={300} data={dataBar} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div className="chart-wrapper">
          <h2>Pie Chart</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default App;
