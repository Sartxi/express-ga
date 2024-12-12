'use strict';

const fs = require('fs');

function formatResponse(response) {
  const { metricHeaders, rows } = response;
  return rows.reduce((result, row) => {
    const { dimensionValues, metricValues } = row;
    const first = dimensionValues.shift();
    const value = first.value;
    if (!result[value]) result[value] = [];
    result[value].push(
      dimensionValues.map(dimension => ({
        [dimension.value]: metricValues.map(({ value }, i) => ({
          [metricHeaders[i].name]: value
        }))
      }))
    );
    return result;
  }, {});
}

function analytics(
  properties,
  propertyId = process.env.GOOGLE_PROJECT_ID,
  credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  const { BetaAnalyticsDataClient } = require('@google-analytics/data');
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: credentials,
  });

  async function runReport(props = {
    dateRanges: [{ startDate: '2020-03-31', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }]
  }) {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-03-31',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'country',
        }, {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    const formatted = formatResponse(response);

    fs.writeFile('./ga.json', JSON.stringify(formatted, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Data written to output.json');
      }
    });

    return formatted;
  }
  return runReport(properties);
}

process.on('unhandledRejection', err => {
  process.exitCode = 1;
  console.error(err.message);
});

module.exports = { analytics };
