const faker = require('faker');
const fs = require('fs');

const dataEntry = {};

dataEntry.name = faker.name.firstName();
dataEntry.descriptor = faker.hacker.adjective() + faker.hacker.noun();

fs.writeFile('testData.json', JSON.stringify(dataEntry), (err) => {
  if (err) {
    console.log(err)
  }
  console.log('saved data!');
})