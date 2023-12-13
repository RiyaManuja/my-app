import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GammaStats = () => {
  const [wineData, setWineData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/data'); 
        setWineData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateGamma = (data) => {
    return data.map(point => ({
      ...point,
      Gamma: (point.Ash * point.Hue) / point.Magnesium,
    }));
  };

  const calculateClassWiseStatistics = (data) => {
    const classWiseGamma = {};
    data.forEach(point => {
      const className = `Class ${point.Alcohol}`;
      if (!classWiseGamma[className]) {
        classWiseGamma[className] = [];
      }
      classWiseGamma[className].push(point.Gamma);
    });

    const result = {};

    for (const className in classWiseGamma) {
      const gammaValues = classWiseGamma[className];

      const mean = gammaValues.reduce((sum, value) => sum + value, 0) / gammaValues.length;

      const sortedValues = gammaValues.slice().sort((a, b) => a - b);
      const middle = Math.floor(sortedValues.length / 2);
      const median = sortedValues.length % 2 === 0
        ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
        : sortedValues[middle];

      const frequencyMap = {};
      let mode = null;
      let maxFrequency = 0;

      gammaValues.forEach(value => {
        frequencyMap[value] = (frequencyMap[value] || 0) + 1;
        if (frequencyMap[value] > maxFrequency) {
          maxFrequency = frequencyMap[value];
          mode = value;
        }
      });

      result[className] = {
        Mean: mean.toFixed(3),
        Median: median.toFixed(3),
        Mode:  mode !== null ? mode.toFixed(3) : null,
      };
    }

    return result;
  };

  const updatedData = calculateGamma(wineData);
  const classWiseStatistics = calculateClassWiseStatistics(updatedData);

  return (
    <div>
      <h1>Gamma Statistics</h1>
      <table>
        <thead>
          <tr>
            <th>Measure</th>
            {Object.keys(classWiseStatistics).map(className => (
              <th key={className}>{className}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gamma Mean</td>
            {Object.keys(classWiseStatistics).map(className => (
              <td key={className}>{classWiseStatistics[className].Mean}</td>
            ))}
          </tr>
          <tr>
            <td>Gamma Median</td>
            {Object.keys(classWiseStatistics).map(className => (
              <td key={className}>{classWiseStatistics[className].Median}</td>
            ))}
          </tr>
          <tr>
            <td>Gamma Mode</td>
            {Object.keys(classWiseStatistics).map(className => (
              <td key={className}>{classWiseStatistics[className].Mode}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GammaStats;
