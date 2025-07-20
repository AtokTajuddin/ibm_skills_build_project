/**
 * Database and Environment Validation Script for Virtual Hospital Project
 * 
 * This script validates the MongoDB connection, checks required collections,
 * and ensures all necessary environment variables are set.
 * Run with: node validate.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

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
console.log('Virtual Hospital Project - Environment Validation');
console.log('====================================================');
console.log('');

// Check environment variables
function validateEnvironmentVariables() {
    console.log('Checking backend environment variables...');
    const requiredBackendVars = [
        'PORT',
        'MONGODB_URI',
        'JWT_SECRET',
        'FRONTEND_URL',
        'LLM_API_KEY'
    ];
    
    const missingVars = [];
    for (const variable of requiredBackendVars) {
        if (!process.env[variable]) {
            missingVars.push(variable);
        }
    }
    
    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        console.error('Please update your backend/.env file.');
        return false;
    }
    
    console.log('All required backend environment variables are set.');
    
    // Check optional environment variables (for OAuth)
    const optionalVars = [];
    
    const missingOptionalVars = [];
    for (const variable of optionalVars) {
        if (!process.env[variable]) {
            missingOptionalVars.push(variable);
        }
    }
    
    if (missingOptionalVars.length > 0) {
        console.log(`\nNote: The following optional variables are not set: ${missingOptionalVars.join(', ')}`);
    }
    
    return true;
}

// Check frontend environment variables
function validateFrontendEnvironment() {
    console.log('\nChecking frontend environment variables...');
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    
    if (!fs.existsSync(frontendEnvPath)) {
        console.error('Frontend .env file not found. Please run setup.sh or setup.bat first.');
        return false;
    }
    
    const frontendEnv = dotenv.parse(fs.readFileSync(frontendEnvPath));
    const requiredFrontendVars = [
        'REACT_APP_API_URL'
    ];
    
    const missingVars = [];
    for (const variable of requiredFrontendVars) {
        if (!frontendEnv[variable]) {
            missingVars.push(variable);
        }
    }
    
    if (missingVars.length > 0) {
        console.error(`Missing required frontend environment variables: ${missingVars.join(', ')}`);
        console.error('Please update your frontend/.env file.');
        return false;
    }
    
    console.log('All required frontend environment variables are set.');
    
    // Check optional frontend environment variables
    const optionalFrontendVars = [];
    
    const missingOptionalVars = [];
    for (const variable of optionalFrontendVars) {
        if (!frontendEnv[variable]) {
            missingOptionalVars.push(variable);
        }
    }
    
    if (missingOptionalVars.length > 0) {
        console.log(`\nNote: The following optional frontend variables are not set: ${missingOptionalVars.join(', ')}`);
    }
    
    return true;
}

// Validate MongoDB connection and required collections
async function validateDatabase() {
    try {
        console.log('\nValidating MongoDB connection and collections...');
        const client = new MongoClient(mongoUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        
        await client.connect();
        console.log('MongoDB connection successful!');
        
        const db = client.db(dbName);
        
        // Check for required collections
        const requiredCollections = ['users', 'consultations', 'conversations'];
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        const missingCollections = requiredCollections.filter(col => !collectionNames.includes(col));
        
        if (missingCollections.length > 0) {
            console.error(`Missing required collections: ${missingCollections.join(', ')}`);
            console.error('Please run setup.js to create the required collections.');
            await client.close();
            return false;
        }
        
        console.log('All required collections exist in the database.');
        
        // Check for admin user
        const adminUser = await db.collection('users').findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('Admin user not found. Please run setup.js to create the admin user.');
            await client.close();
            return false;
        }
        
        console.log('Admin user exists in the database.');
        await client.close();
        return true;
    } catch (error) {
        console.error('MongoDB validation failed:', error.message);
        console.error('\nPlease make sure MongoDB is installed and running.');
        return false;
    }
}

// Main validation function
async function validateEnvironment() {
    let envValid = validateEnvironmentVariables();
    let frontendValid = validateFrontendEnvironment();
    let dbValid = await validateDatabase();
    
    console.log('\n====================================================');
    if (envValid && frontendValid && dbValid) {
        console.log('✅ All validation checks passed successfully!');
        console.log('Your Virtual Hospital Project is correctly configured.');
    } else {
        console.log('❌ Some validation checks failed. Please address the issues above.');
    }
    console.log('====================================================');
    
    return envValid && frontendValid && dbValid;
}

// Run the validation
validateEnvironment().then(valid => {
    if (!valid) {
        process.exit(1);
    }
}).catch(error => {
    console.error('Validation error:', error);
    process.exit(1);
});
