// testScript.js

const { expect } = require('chai');
const { describe, it, before, after } = require('mocha');
const { MongoClient } = require('mongodb');
const { program } = require('commander');
const fs = require('fs-extra');

// Import the runConertToMongoDB function directly
const { runConertToMongoDB } = require('./Streamlined-Data-Integration-Using-MongoDB.mjs');

// Define your test cases
describe('Data Import Script Tests', () => {
  let client;

  // Connect to MongoDB before running the tests
  before(async () => {
    const { url } = program.opts();
    client = new MongoClient(url);
    await client.connect();
  });

  // Test Case 1: CSV File Format Import
  it('should import data from CSV file', async () => {
    // Set up test parameters
    program.parse(['node', 'Streamlined-Data-Integration-Using-MongoDB.mjs', '-u', 'mongodb://localhost:27017', '-d', 'Air Quality Index for New York City', '-f', 'AirQuality.csv', '-n', 'AirQualityIndexDatainCSV']);
    
    // Run the data import script
    await runConertToMongoDB();

    // Check the results (replace with actual expected values)
    const db = client.db('Air Quality Index for New York City');
    const collection = db.collection('AirQualityIndexDatainCSV');
    const count = await collection.countDocuments({});
    expect(count).to.be.greaterThan(0);
  });

  // Test Case 2: JSON File Format Import
  it('should import data from JSON file', async () => {
    // Set up test parameters
    program.parse(['node', 'Streamlined-Data-Integration-Using-MongoDB.mjs', '-u', 'mongodb://localhost:27017', '-d', 'Air Quality Index for New York City', '-f', 'AirQuality.json', '-n', 'AirQualityIndexDatainJSON']);

    // Run the data import script
    await runConertToMongoDB();

    // Check the results (replace with actual expected values)
    const db = client.db('York');
    const collection = db.collection('AirQualityIndexDatainJSON');
    const count = await collection.countDocuments({});
    expect(count).to.be.greaterThan(0);
  });

  // will add more test cases for other file types (Will be later in the future)

  // Disconnecting from MongoDB after running the test cases
  after(async () => {
    await client.close();
  });
});
