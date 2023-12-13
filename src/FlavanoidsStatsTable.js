import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const fetchData = async () => {
  const response = await axios.get('http://localhost:4000/data');
  return response.data; 
};

const calculateMean = (data, className) => {
  const classData = data.filter(item => item.Alcohol === className);
  const flavanoidsValues = classData.map(item => item.Flavanoids);
  const mean = flavanoidsValues.reduce((acc, value) => acc + value, 0) / flavanoidsValues.length;
  return mean.toFixed(3); 
};

const calculateMedian = (data, className) => {
  const classData = data.filter(item => item.Alcohol === className);
  const flavanoidsValues = classData.map(item => item.Flavanoids).sort((a, b) => a - b);
  const middleIndex = Math.floor(flavanoidsValues.length / 2);

  if (flavanoidsValues.length % 2 === 0) {
    const median = (flavanoidsValues[middleIndex - 1] + flavanoidsValues[middleIndex]) / 2;
    return median.toFixed(3);
  } else {
    return flavanoidsValues[middleIndex].toFixed(3);
  }
};

const calculateMode = (data, className) => {
  const classData = data.filter(item => item.Alcohol === className);
  const flavanoidsValues = classData.map(item => item.Flavanoids);
  const counts = {};

  flavanoidsValues.forEach(value => {
    counts[value] = (counts[value] || 0) + 1;
  });

  const mode = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  return mode;
};

const FlavanoidsStatsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAndCalculateStats = async () => {
      const result = await fetchData();
      setData(result);
    };

    fetchDataAndCalculateStats();
  }, []);

  const uniqueClasses = Array.from(new Set(data.map(item => item.Alcohol)));

  return (
    <>
    <h1>Class Wise Statistics</h1>
    <table>
      <thead>
        <tr>
          <th>Measure</th>
          {uniqueClasses.map(className => (
            <th key={className}>Class {className}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Flavanoids Mean</td>
          {uniqueClasses.map(className => (
            <td key={className}>{calculateMean(data, className)}</td>
          ))}
        </tr>
        <tr>
          <td>Flavanoids Median</td>
          {uniqueClasses.map(className => (
            <td key={className}>{calculateMedian(data, className)}</td>
          ))}
        </tr>
        <tr>
          <td>Flavanoids Mode</td>
          {uniqueClasses.map(className => (
            <td key={className}>{calculateMode(data, className)}</td>
          ))}
        </tr>
      </tbody>
    </table>
    </>
  );
};

export default FlavanoidsStatsTable;
