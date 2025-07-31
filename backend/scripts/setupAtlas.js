import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupMongoDBAtlas = async () => {
  console.log('🚀 MongoDB Atlas Setup for HEVA Cultural Inclusion System');
  console.log('=' .repeat(60));
  
  try {
    // Check if MongoDB Atlas URI is already configured
    const existingURI = process.env.MONGODB_ATLAS_URI;
    
    if (existingURI && existingURI !== 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority') {
      console.log('✅ MongoDB Atlas URI already configured');
      console.log('📍 URI:', existingURI.replace(/\/\/.*@/, '//***:***@'));
      
      const testConnection = await question('Would you like to test the connection? (y/n): ');
      if (testConnection.toLowerCase() === 'y') {
        await testMongoDBConnection(existingURI);
      }
      return;
    }
    
    console.log('📋 MongoDB Atlas Setup Instructions:');
    console.log('1. Go to https://cloud.mongodb.com');
    console.log('2. Create a free account or sign in');
    console.log('3. Create a new cluster (M0 Free tier recommended)');
    console.log('4. Create a database user with read/write permissions');
    console.log('5. Get your connection string');
    console.log('');
    
    const setupChoice = await question('Do you have your MongoDB Atlas connection string ready? (y/n): ');
    
    if (setupChoice.toLowerCase() === 'y') {
      const connectionString = await question('Enter your MongoDB Atlas connection string: ');
      
      if (connectionString && connectionString.includes('mongodb+srv://')) {
        console.log('🔗 Testing connection...');
        await testMongoDBConnection(connectionString);
        
        const saveChoice = await question('Would you like to save this connection string to .env file? (y/n): ');
        if (saveChoice.toLowerCase() === 'y') {
          await saveConnectionString(connectionString);
        }
      } else {
        console.log('❌ Invalid connection string format. Please check your MongoDB Atlas connection string.');
      }
    } else {
      console.log('📖 Please follow the setup instructions above and run this script again.');
      console.log('💡 You can also manually add your connection string to the .env file:');
      console.log('   MONGODB_ATLAS_URI=your_connection_string_here');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
};

const testMongoDBConnection = async (connectionString) => {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connection successful!');
    console.log(`📍 Connected to: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔧 MongoDB version: ${conn.connection.version}`);
    
    // Test basic operations
    console.log('🧪 Testing basic operations...');
    
    // Test write operation
    const testCollection = conn.connection.db.collection('test_connection');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'HEVA Cultural Inclusion System connection test'
    });
    console.log('✅ Write operation successful');
    
    // Test read operation
    const result = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Cleanup successful');
    
    await mongoose.disconnect();
    console.log('🔄 Connection closed');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.error('🌐 Network Error: Check your internet connection');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('🔍 Server Selection Error: Check your connection string and credentials');
    } else if (error.name === 'MongoParseError') {
      console.error('📝 Parse Error: Check your connection string format');
    } else if (error.name === 'MongoError' && error.code === 18) {
      console.error('🔐 Authentication Error: Check your username and password');
    }
    
    throw error;
  }
};

const saveConnectionString = async (connectionString) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `MONGODB_ATLAS_URI=${connectionString}\n`;
    
    // Check if .env file exists
    if (fs.existsSync(envPath)) {
      const existingContent = fs.readFileSync(envPath, 'utf8');
      
      if (existingContent.includes('MONGODB_ATLAS_URI=')) {
        // Update existing MONGODB_ATLAS_URI
        const updatedContent = existingContent.replace(
          /MONGODB_ATLAS_URI=.*/,
          `MONGODB_ATLAS_URI=${connectionString}`
        );
        fs.writeFileSync(envPath, updatedContent);
      } else {
        // Append to existing .env file
        fs.appendFileSync(envPath, envContent);
      }
    } else {
      // Create new .env file
      fs.writeFileSync(envPath, envContent);
    }
    
    console.log('✅ Connection string saved to .env file');
    console.log('🔒 Remember to add .env to your .gitignore file for security');
    
  } catch (error) {
    console.error('❌ Failed to save connection string:', error.message);
  }
};

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupMongoDBAtlas();
}

export default setupMongoDBAtlas; 