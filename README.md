# Streamlined Data Integration Using MongoDB

## Introduction

The project's core focus lies in crafting a robust development strategy that seamlessly integrates MongoDB, JavaScript, and Node.js. This endeavor seeks to establish an advanced framework capable of efficiently managing extensive datasets with flexibility, scalability, and efficiency. The foundation of the project rests upon a script designed for the effortless import of data from CSV, XML, RDF, and JSON files into a MongoDB database. 

## Pre-requisites and tools required

- Must have Visual Studio Code or any other related software installed
- Node.js and npm installed (npm install or npm i).
- Download MongoDB Compass on your system
- Try to access to a MongoDB database with mongodb://localhost:27017.
- Download Dummy or actual (I used City of New York Air Quality Dataset and Air Traffic Passenger Statistics, City of San Francisco) in CSV, XML, JSON, RDF file formats

## Installation Procedure

Clone the repository or download it to your local directory.
Initially, these scripts mostly depend on several npm packages, which are mentioned below:

- `fs-extra`
- `csv-parser`
- `mongodb`
- `commander`
- `xml2js`
- `rdflib`

To install the above-mentioned dependencies, navigate to your project directory and then run the below command in bash:

```bash command

npm install fs-extra csv-parser mongodb commander xml2js rdflib

```

Once all these steps are performed, run the following commands to import data to your MongoDB instance:

## Commands
Importing respective file documents to the MongoDB database (Base Command): This is just a base command (don't run, just for understanding purposes—below command).

```bash
node Streamlined-Data-Integration-Using-MongoDB.mjs -u <database_url> -d <database_name> -c <file_format_path> -n <collection_name>
```

## Here are the details of the command-line arguments given above:

- `-u, --url <type>`: The MongoDB URL. Default will be '**mongodb://localhost:27017**'.
- `-d, --dbName <type>`: The name of the MongoDB database. The default database is 'Air Quality Index for New York City'.
- `-c, --csv <type>`: The path of the file format (JSON, CSV, XML, RDF). The default file name is 'AirQuality.csv'.
- `-n, --collectionName <type>`: The name of the MongoDB collection to import to. Default is 'AirQualityIndexDatainCSV'.


## Software Commands (please run one of these commands based on your file extension):

1. Importing CSV file document to MongoDB database

```bash
node Streamlined-Data-Integration-Using-MongoDB.mjs -u "mongodb://localhost:27017" -d Air Quality Index for New York City -f "AirQuality.csv" -n AirQualityIndexDatainCSV
```

2. Importing JSON file document to MongoDB database

```bash
node Streamlined-Data-Integration-Using-MongoDB.mjs -u "mongodb://localhost:27017" -d Air Quality Index for New York City -f "AirQuality.json" -n AirQualityIndexDatainJSON
```

3. Importing XML file document to MongoDB database

```bash
node Streamlined-Data-Integration-Using-MongoDB.mjs -u "mongodb://localhost:27017" -d Air Quality Index for New York City -f "AirQuality.xml" -n AirQualityIndexDatainXML
```

4. Importing RDF file document to MongoDB database

```bash
node Streamlined-Data-Integration-Using-MongoDB.mjs -u "mongodb://localhost:27017" -d Air Quality Index for New York City -f "AirQuality.rdf" -n AirQualityIndexDatainRDF
```


The provided command establishes a connection to a MongoDB database located at "**mongodb://localhost:27017**". It selects a database named "Air" reads data from a respective file format, such as "AirQuality.csv" and proceeds to import each row as an individual document into a collection named "AirQualityIndexDatainCSV" 

Upon the successful execution of the script, it proceeds to showcase the number of inserted documents and subsequently concludes by closing the connection to the MongoDB server.
