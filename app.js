const scheduler = require('./src/scheduler');
const cfg = require('./src/config');
const server = require('./server');

scheduler.start();
// Change 'cfg.port' to also include '0.0.0.0' as the host
server.listen(cfg.port, '0.0.0.0', function() {
  // Optionally, print your local IP address for convenience
  const os = require('os');
  const ifaces = os.networkInterfaces();
  let localIp = 'localhost';
  for (const iface of Object.values(ifaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        localIp = alias.address;
        break;
      }
    }
  }
  console.log(
    `Starting sample-appointment-reminders at http://${localIp}:${cfg.port}`
  );
});
