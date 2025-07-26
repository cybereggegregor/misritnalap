exports.handler = async (event) => {
  const visitorData = JSON.parse(event.body);
  let ipAddress = event.headers['client-ip'] || event.headers['x-forwarded-for'] || event.headers['x-real-ip'];
  console.log('Visitor data:', { ...visitorData, ipAddress });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Visitor data logged' }),
  };
};