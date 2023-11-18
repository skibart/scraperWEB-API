import https from 'https';

const handler = async () => {
  const url = 'https://skiresortsapi.onrender.com/';
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res: any) => {
      if (res.statusCode === 200) {
        console.log('pinggg...');
        resolve({
          statusCode: 200,
          body: 'Server pinged successfully',
        });
      } else {
        reject(new Error(`Server ping failed with status code: ${res.statusCode}`));
      }
    });

    req.on('error', (error: any) => {
      reject(error);
    });

    req.end();
  });
};

async function pingServer(): Promise<void> {
  setInterval(
    () => {
      handler();
    },
    14 * 60 * 1000,
  );
}

export default pingServer;
