// initiate an express app boilerplate
const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: "us-east-1" });

// Create DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

async function getData() {
  var params = {
    TableName: "products",
  };

  let scanResults = [];
  let items;

  do {
    items = await docClient.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != "undefined");
  console.log(scanResults);
}

// getData();

const arrayOfRandomRegions = [
    "us",
    "eur",
    "apac",
    "emea",
]

// an array of random supermarket products
const arrayOfRandomProducts = [
    "apple",
    "banana",
    "orange",
    "milk",
    "bread",
    "butter",
    "cheese",
    "chicken",
    "beef",
    "pork",
    "fish",
    "rice",
    "potato",
    "tomato",
    "onion",
    "carrot",
    "cucumber",
    "lettuce",
    "cabbage",
    "broccoli",
    "spinach",
    "egg"
]



// create a function that will put data in dynamoDB
const putData = async (name, region) => {
    var params = {
        TableName: 'products',
        Item: {
          'id': uuidv4(),
          'product_name': name,
          'region': region
        }
      };

      docClient.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
}

// getData()
// call putData on all items arrayOfRandomProducts
// arrayOfRandomProducts.forEach((product) => {
//     putData(product, arrayOfRandomRegions[Math.floor(Math.random() * arrayOfRandomRegions.length)])
// })

async function get_products (region) {
    var params = {
        TableName: "products",
        ExpressionAttributeValues: {
            ":region": region,
            ":product_name": "apple"
        },
        KeyConditionExpression: "region = :region and product_name = :product_name",
        FilterExpression: "product_name = :product_name and region = :region",
    };

    let scanResults = [];
    let items;

    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");
    console.log(scanResults);
}

get_products("us")

// initiate a server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
