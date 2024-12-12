'use strict';

function formatGA(response) {
  const { metricHeaders, rows } = response;
  return rows.reduce((result, row) => {
    const { dimensionValues, metricValues } = row;
    const first = dimensionValues.length > 1 ? dimensionValues.shift() : dimensionValues[0];
    const value = first.value;
    if (!result[value]) result[value] = metricValues.map(({ value }, i) => ({
      [metricHeaders[i].name]: value
    }));
    return result;
  }, {});
}

function analytics(
  properties,
  propertyId = process.env.GOOGLE_PROJECT_ID,
  credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  const { BetaAnalyticsDataClient } = require('@google-analytics/data');
  const analyticsDataClient = new BetaAnalyticsDataClient({ keyFilename: credentials });
  async function runReport(props) {
    const [response] = await analyticsDataClient.runReport({ property: `properties/${propertyId}`, ...props });
    const formatted = formatGA(response);
    return formatted;
  }
  return runReport(properties);
}

process.on('unhandledRejection', err => {
  process.exitCode = 1;
  console.error(err.message);
});

module.exports = { analytics };
