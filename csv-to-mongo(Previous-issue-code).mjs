












//Please don't run this file.
//This code is the previous and I fixed it in Streamlined--Data-Integration-with-MongoDB.mjs file




















import fs from 'fs-extra';
import csv from 'csv-parser';
import { MongoClient } from 'mongodb';
import { program } from 'commander';

// Setting up command-line options
program
  .version('1.0.0')
  .option('-u, --url <type>', 'MongoDB URL', 'mongodb://localhost:27017')
  .option('-d, --dbName <type>', 'Database name', 'test')
  .option('-c, --csv <type>', 'CSV file path', 'file.csv')
  .option('-n, --collectionName <type>', 'Collection name', 'data')
  .parse(process.argv);

async function run() {
  const { url, dbName, csv: fp, collectionName } = program.opts();
  const client = new MongoClient(url);

  await client.connect();
  console.log('Connected successfully to server');

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const documents = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(fp)
      .pipe(csv())
      .on('data', (data) => documents.push(data))
      .on('end', async () => {
        try {
          // Use the collection's insertMany method to add all the documents
          const result = await collection.insertMany(documents);
          console.log(`Inserted ${result.insertedCount} documents`);
          await client.close();
          console.log('Connection closed');
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => reject(error));
  });
}

run().catch(console.dir);