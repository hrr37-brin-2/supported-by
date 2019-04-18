const faker = require('faker');
const fs = require('fs');


const dataList = [];

for (let i = 0; i < 10000; i++) {
  let dataEntry = {};
  dataEntry.name = faker.name.firstName();
  dataEntry.descriptor = faker.hacker.adjective() + faker.hacker.noun();
  dataList.push(dataEntry);
}


fs.writeFile('testData.json', JSON.stringify(dataList), (err) => {
  if (err) {
    console.log(err)
  }
  console.log('saved data!');
})