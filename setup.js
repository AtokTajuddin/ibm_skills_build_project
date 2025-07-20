/**
 * Database and Environment Setup Script for Virtual Hospital Project
 * 
 * This script initializes the MongoDB database with required collections and initial data.
 * Run with: node setup.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// Load environment variables
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
    dotenv.config({ path: backendEnvPath });
} else {
    console.error('Backend .env file not found. Please run setup.sh or setup.bat first.');
    process.exit(1);
}

// MongoDB connection string
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_hospital';
const dbName = mongoUri.split('/').pop().split('?')[0]; // Extract database name from URI

console.log('====================================================');
console.log('Virtual Hospital Project - Database Setup');
console.log('====================================================');
console.log('');

// Check if MongoDB is installed and running
async function checkMongoDBConnection() {
    try {
        console.log('Checking MongoDB connection...');
        const client = new MongoClient(mongoUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        await client.connect();
        await client.db(dbName).command({ ping: 1 });
        console.log('MongoDB connection successful!');
        return client;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        console.error('\nPlease make sure MongoDB is installed and running.');
        console.error('If MongoDB is not installed:');
        console.error('  - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/');
        console.error('  - macOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/');
        console.error('  - Linux: https://docs.mongodb.com/manual/administration/install-on-linux/');
        process.exit(1);
    }
}

// Create collections and indexes
async function setupDatabase(client) {
    try {
        const db = client.db(dbName);
        console.log(`\nSetting up database: ${dbName}`);

        // Create users collection
        console.log('Creating users collection...');
        if (!(await db.listCollections({ name: 'users' }).hasNext())) {
            await db.createCollection('users');
            // Create indexes for users collection
            await db.collection('users').createIndex({ email: 1 }, { unique: true });
            console.log('Users collection created with indexes.');
        } else {
            console.log('Users collection already exists.');
        }

        // Create consultations collection
        console.log('Creating consultations collection...');
        if (!(await db.listCollections({ name: 'consultations' }).hasNext())) {
            await db.createCollection('consultations');
            // Create indexes for consultations collection
            await db.collection('consultations').createIndex({ userId: 1 });
            await db.collection('consultations').createIndex({ createdAt: -1 });
            console.log('Consultations collection created with indexes.');
        } else {
            console.log('Consultations collection already exists.');
        }

        // Create conversations collection for storing chat history with the virtual doctor
        console.log('Creating conversations collection...');
        if (!(await db.listCollections({ name: 'conversations' }).hasNext())) {
            await db.createCollection('conversations');
            await db.collection('conversations').createIndex({ userId: 1 });
            await db.collection('conversations').createIndex({ createdAt: -1 });
            console.log('Conversations collection created with indexes.');
        } else {
            console.log('Conversations collection already exists.');
        }

        // Create admin user if it doesn't exist
        console.log('\nChecking for admin user...');
        const adminExists = await db.collection('users').findOne({ role: 'admin' });
        if (!adminExists) {
            const adminUser = {
                name: 'Admin',
                email: 'admin@virtualhospital.com',
                password: '$2b$10$mLMGkDoZ5gVQgEkxiwdYWOo3nUmjBFmLKQIDc16Qv0YnQIUqhJg1K', // hashed password: admin123
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await db.collection('users').insertOne(adminUser);
            console.log('Admin user created:');
            console.log('  - Email: admin@virtualhospital.com');
            console.log('  - Password: admin123');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('\nDatabase setup completed successfully!');
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

// Check dependencies
async function checkDependencies() {
    console.log('\nChecking required Node.js packages...');
    const backendPackageJsonPath = path.join(__dirname, 'backend', 'package.json');
    
    try {
        // Ensure dotenv is installed for this script
        try {
            require.resolve('dotenv');
            console.log('dotenv package is installed.');
        } catch (err) {
            console.log('Installing dotenv package for this script...');
            execSync('npm install dotenv', { stdio: 'inherit' });
        }

        // Ensure mongodb is installed for this script
        try {
            require.resolve('mongodb');
            console.log('mongodb package is installed.');
        } catch (err) {
            console.log('Installing mongodb package for this script...');
            execSync('npm install mongodb', { stdio: 'inherit' });
        }

        // Check if backend package.json exists
        if (fs.existsSync(backendPackageJsonPath)) {
            console.log('Backend package.json found.');
        } else {
            console.error('Backend package.json not found. Please ensure the project structure is correct.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error checking dependencies:', error);
        process.exit(1);
    }
}

// Main function
async function main() {
    await checkDependencies();
    const client = await checkMongoDBConnection();
    await setupDatabase(client);
    
    console.log('\n====================================================');
    console.log('Virtual Hospital Project setup completed successfully!');
    console.log('====================================================');
    console.log('\nTo start the application:');
    console.log('  - Windows: Run start.bat');
    console.log('  - Linux/Mac: Run ./start.sh');
    console.log('\nAdmin user credentials:');
    console.log('  - Email: admin@virtualhospital.com');
    console.log('  - Password: admin123');
    console.log('====================================================');
    
    await client.close();
}

// Run the script
main().catch(console.error);
