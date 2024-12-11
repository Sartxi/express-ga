'use strict';

// dateRanges: [
//   {
//     startDate: '2020-03-31',
//     endDate: 'today',
//   },
// ],
// dimensions: [
//   {
//     name: 'country',
//   },
// ],
// metrics: [
//   {
//     name: 'activeUsers',
//   },
// ]

function analytics(
  properties,
  propertyId = process.env.GOOGLE_PROJECT_ID,
  credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  const {BetaAnalyticsDataClient} = require('@google-analytics/data');
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: credentials,
  });

  async function runReport() {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      ...properties,
    });

    response.rows.forEach(row => {
      console.log(row.dimensionValues[0], row.metricValues[0]);
    });

    return response;
  }
  
  return runReport();
}

process.on('unhandledRejection', err => {
  process.exitCode = 1;
  console.error(err.message);
});

module.exports = { analytics };
