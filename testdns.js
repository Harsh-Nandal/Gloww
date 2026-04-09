const dns = require("node:dns").promises;

(async () => {
  try {
    console.log("Testing MongoDB SRV lookup...");
    const result = await dns.resolveSrv("_mongodb._tcp.cluster0.pk9mfuy.mongodb.net");
    console.log("SRV Result:", result);
  } catch (err) {
    console.error("DNS ERROR:", err);
  }
})();