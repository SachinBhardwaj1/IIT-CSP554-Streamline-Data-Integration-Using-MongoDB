import fs from 'fs-extra';
import csv from 'csv-parser';
import { MongoClient } from 'mongodb';
import { program } from 'commander';
import { parseString } from 'xml2js';
import * as $rdf from 'rdflib';

// Importing the program options
program
  .version('1.0.0')
  .option('-u, --url <type>', 'MongoDB URL', 'mongodb://localhost:27017') // Adding MongoDB URL option, default value is'mongodb://localhost:27017
  .option('-d, --dbName <type>', 'Database name', 'Air Quality Index for New York City') // Adding database name option, default value is 'AirQualityIndexForNewYorkCity'
  .option('-f, --file <type>', 'Data file path', 'AirQuality.csv') // Adding CSV option, default value is 'AirQuality.csv'
  .option('-j, --json <type>', 'JSON file path', 'AirQuality.json') // Adding JSON option, default value is 'AirQuality.json'
  .option('-x, --xml <type>', 'XML file path', 'AirQuality.xml') // Adding XML option, default value is 'AirQuality.xml'
  .option('-r, --rdf <type>', 'RDF file path', 'AirQuality.rdf') // Adding RDF option, default value is 'AirQuality.rdf'
  .option('-n, --collectionName <type>', 'Collection name', 'AirQualityIndexData')
  .parse(process.argv);

async function runConertToMongoDB() {
  const { url, dbName, file: filePath, collectionName } = program.opts();
  const client = new MongoClient(url);

  // Connecting to localhost mongodb://localhost:27017
  try {
    await client.connect();
    console.log('Congratulations!!!! Server is now connected successfully');
    // Creating a database if it does not exist
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const documents = [];
    const fileExtension = filePath.split('.').pop();

    // Checking the file extension
    switch (fileExtension) {
      // CSV file format case
      case 'csv':
        // CSV file format
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => documents.push(data))
          .on('end', async () => {
            try {
              const result = await collection.insertMany(documents);
              console.log(`Inserted ${result.insertedCount} CSV Documents`);
            } catch (error) {
              console.error(error);
            } finally {
              await client.close();
              console.log('Data successfully uploaded and now closing the connection');
            }
          });
        break;

      // JSON file format case
      case 'json':
        const jsonData = await fs.readFile(filePath, 'utf8');
        const jsonView = JSON.parse(jsonData).meta.view;

        // Checking if the JSON file has the expected structure or not
        if (jsonView) {
          const jsonDocuments = Array.isArray(jsonView) ? jsonView : [jsonView];

          try {
            const result = await collection.insertMany(jsonDocuments);
            console.log(`Inserted ${result.insertedCount} JSON Documents`);
          } catch (error) {
            console.error(error);
          } finally {
            await client.close();
            console.log('Data successfully uploaded and now closing the connection');
          }
        } else {
          console.error('JSON file does not contains the expected structure.');
          await client.close();
        }
        break;
      
      // XML file format case
      case 'xml':
        const xmlData = await fs.readFile(filePath, 'utf8');
        parseString(xmlData, async (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
          // Checking if the XML file has the expected structure or not
          const xmlDocuments = result.response.row;
      
          // Checking xmlDocuments are always an array or not
          const formattedXmlDocuments = Array.isArray(xmlDocuments) ? xmlDocuments : [xmlDocuments];
      
          // Checking if the XML file has the expected structure or not
          if (formattedXmlDocuments.length === 0 || !formattedXmlDocuments[0].hasOwnProperty('row')) {
            console.error('XML file does not contain the expected structure.');
            await client.close();
            return;
          }
      
          try {
            const insertResult = await collection.insertMany(formattedXmlDocuments);
            console.log(`Inserted ${insertResult.insertedCount} XML Documents`);
          } catch (error) {
            console.error(error);
          } finally {
            await client.close();
            console.log('Data successfully uploaded, and now closing the connection');
          }
        });
        break;
      
      // RDF file format case
      case 'rdf':
        // RDF file format
        const rdfData = await fs.readFile(filePath, 'utf8');
        const rdfDocuments = await parseRDF(rdfData, collection);
      
        try {
          if (rdfDocuments.length > 0) {
            const result = await collection.insertMany(rdfDocuments);
            console.log(`Inserted ${result.insertedCount} RDF Documents`);
          } else {
            console.log('No new documents to insert.');
          }
        } catch (error) {
          console.error(error);
        } finally {
          await client.close();
          console.log('Data successfully uploaded, and now closing the connection');
        }
        break;

      default:
        console.error('Currently this file type is not Supported');
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to parse RDF file
async function parseRDF(content) {
  const store = $rdf.graph();
  // Creating a new store object
  $rdf.parse(content, store, 'https://data.cityofnewyork.us/resource/c3uy-2p5r/', 'application/rdf+xml');
  
  // Converting parsed data to that format which is suitable for MongoDB insertion
  const rdfDocuments = store.statements.map((statement) => {
    const subject = statement.subject.value;
    const predicates = store.match(subject, null, null);
    const document = { rowID: subject };

    // Iterating over the predicates and adding
    predicates.forEach((predicate) => {
      const predicateName = predicate.predicate.value.split('#').pop();
      const object = predicate.object.value;
      document[predicateName] = object;
    });

    return document;
  });

  return rdfDocuments;
}

runConertToMongoDB();