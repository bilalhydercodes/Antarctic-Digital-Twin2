const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

async function testConnection() {
  console.log('\n=================================================================');
  console.log('       🔍 TESTING MONGODB ATLAS DATABASE CONNECTION');
  console.log('=================================================================');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI is not set in server/.env');
    process.exit(1);
  }

  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log('Connecting to:', maskedUri);

  try {
    const startTime = Date.now();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const elapsed = Date.now() - startTime;

    console.log('\n✅ [SUCCESS] DATABASE IS CONNECTED!');
    console.log('-----------------------------------------------------------------');
    console.log('• Connection State    :', mongoose.connection.readyState === 1 ? 'CONNECTED (1)' : 'CONNECTING (2)');
    console.log('• Database Name       :', mongoose.connection.name);
    console.log('• Host Cluster        :', mongoose.connection.host);
    console.log('• Connection Latency  :', elapsed + 'ms');

    // Ping the cluster
    const admin = mongoose.connection.db.admin();
    const pingResult = await admin.ping();
    console.log('• Ping Health Check   :', pingResult.ok === 1 ? 'OK (1)' : 'FAILED');

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('• Total Collections   :', collections.length);
    if (collections.length > 0) {
      console.log('• Collections Found   :', collections.map(c => c.name).join(', '));
    } else {
      console.log('• Collections Found   : None yet (ready to receive collections)');
    }
    console.log('=================================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ [FAILED] DATABASE CONNECTION ERROR:');
    console.error(err.message);
    console.log('=================================================================\n');
    process.exit(1);
  }
}

testConnection();
