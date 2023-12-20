const fs = require('fs');

// Read input JSON file
const inputData = require('../input.json'); // Replace with the actual input file path

// Process the data
const processedData = processData(inputData);

// Write to output JSON file
writeOutputFile('output.json', processedData);

console.log('Process completed successfully.');

// Example processing function
function processData(data) {
  const result = [];

  // Group data by date
  const groupedData = groupDataByDate(data);

  // Calculate min, max, median, and latestDataTimestamp for each day
  for (const date in groupedData) {
    if (Object.prototype.hasOwnProperty.call(groupedData, date)) {
      const dailyData = groupedData[date];
      const min = Math.min(...dailyData);
      const max = Math.max(...dailyData);
      const median = calculateMedian(dailyData);
      const latestDataTimestamp = findLatestTimestamp(dailyData, date);

      result.push({
        date,
        min,
        max,
        median,
        latestDataTimestamp,
      });
    }
  }

  return result;
}

// Function to group data by date
function groupDataByDate(data) {
  const groupedData = {};
  for (const entry of data) {
    const date = entry.timestamp.split('T')[0]; // Assuming timestamp is in the format "YYYY-MM-DDTHH:mm:ss"
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(entry.bpm);
  }
  return groupedData;
}

// Function to calculate the median of an array
function calculateMedian(arr) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);

  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
  } else {
    return sortedArr[middle];
  }
}

// Function to find the latest timestamp in an array
function findLatestTimestamp(arr, date) {
  const latestTimestamp = arr.reduce((latest, bpm) => {
    const entry = inputData.find((data) => data.timestamp.startsWith(date) && data.bpm === bpm);
    if (entry && entry.timestamp > latest) {
      return entry.timestamp;
    }
    return latest;
  }, '');

  return latestTimestamp;
}

// Function to write to the output JSON file
function writeOutputFile(filePath, data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
}
