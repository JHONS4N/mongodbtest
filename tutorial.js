const { MongoClient } = require('mongodb');

async function main() {
    //const uri ="mongodb+srv://S4NAdmin:S4NAdmin@s4ntest-dtujr.mongodb.net/test?retryWrites=true&w=majority";
    const uri = "mongodb://0.0.0.0:27017/thepolyglotdeveloper";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    try {

        await client.connect();
        await deleteOneListingByParameterandValue(client,"sample_airbnb","listingsAndReviews","Cozy Cottage");

        /* 
        
        await listDatabases(client);
        await findOneListingByName(client,"sample_airbnb","listingsAndReviews","Cozy Cottage");
        await updateAllListingsParameters(client,"sample_airbnb","listingsAndReviews","comment")

        await upsertListingByName(client,"sample_airbnb","listingsAndReviews","Cozy Cottage",{name:"Cozy Cottage",property_type: 'House',bedrooms:7,beds:8})

        await updateListingByName(client,"sample_airbnb","listingsAndReviews","Infinite Views",{bedrooms:6,beds:8})

        await findListingsbyParametersandValues(client, "sample_airbnb", "listingsAndReviews",
            "beds", 5)
        await findOneListingByName(client,"sample_airbnb","listingsAndReviews","Infinite Views");
        await createListing(client,"sample_airbnb","listingsAndReviews",{
            name:"Lovely loft",
            summary:"A charming loft in Paris",
            bedrooms:1,
            bathrooms:1
        }); 

        await createdMultipleListings(client,"sample_airbnb","listingsAndReviews",[
        {
            name:"Infinite Views",
            summary:"Modern home",
            property_type:"House",
            bedrooms:1,
            bathrooms:1,
            beds:5
        },
        {
            name:"Private room in london",
            property_type:"Apartament",
            bedrooms:5,
            bathrooms:4.5,
            beds:5
        },
        {
            name:"Beautiful beach House",
            summary:"Enjoy relaxed beach",
            bedrooms:4,
            bathrooms:2.5,
            beds:1,
            last_review: new Date()
        },
    ]);*/

    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}
main().catch(console.err);


async function deleteOneListingByParameterandValue(client, dbname, nameOfcollection,listName,value ){
    const result = await client.db(dbname).collection(nameOfcollection).deleteOne({[listName]:value});
    console.log(`${result.deletedCount} document(s) was/were deleted`)
}
/**
 * Update all parameters of the Listings
 * @param {*} client 
 * @param {*} dbname 
 * @param {*} nameOfcollection 
 * @param {*} listName 
 */
async function updateAllListingsParameters(client, dbname, nameOfcollection, listName){
    const result = await client.db(dbname).collection(nameOfcollection).updateMany(
        {[listName]:{$exists:false}},
        {$set:{[listName]:"Unknown"}});
        console.log(`${result.matchedCount} document(s) matched the query criteria`);
        console.log(`${result.modifiedCount} documents was/were updated `);
}

async function upsertListingByName(client, dbname, nameOfcollection, nameOfListing, updateListing) {
    const result = await client.db(dbname).collection(nameOfcollection).updateOne(
        { name: nameOfListing },
        { $set: updateListing },
        { upsert: true }
    );
    console.log(`${result.matchedCount} document(s) mached the query criteria`)

    if (result.upsertedCount > 0) {
        console.log(`One document was inseted with the id ${result.upsertedId._id}`);
    }
    else {
console.log(`${result.modifiedCount} document(s) was/were updated`)
    }
}

async function findListingsbyParametersandValues(client, dbname, nameOfcollection, listName, value) {
    const cursor = client.db(dbname).collection(nameOfcollection).find({ [listName]: value })
        .sort({ [listName]: -1 });
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${results.length} resultados`)
        results.forEach((result, i) => {
            console.log(JSON.stringify(result));
        });
    } else {
        console.log(`No listing found with the name '${listName}' and value ${value}`)
    }
}
async function updateListingByName(client, dbname, nameOfcollection, nameOfListing, updateListing) {
    const result = await client.db(dbname).collection(nameOfcollection).updateOne(
        { name: nameOfListing },
        { $set: updateListing }
    );
    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}

async function findOneListingByName(client, dbname, nameOfcollection, nameOfListing) {
    const result = await client.db(dbname).collection(nameOfcollection).findOne({ name: nameOfListing });
    if (result) {
        console.log(`Found a listing in the collection with the name'${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`)
    }
}

async function createdMultipleListings(client, dbname, nameOfcollection, newListings) {
    const result = await client.db(dbname).collection(nameOfcollection).insertMany(newListings)
    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds)
}

async function createListing(client, dbname, nameOfcollection, newListing) {
    const result = await client.db(dbname).collection(nameOfcollection).insertOne(newListing);
    console.log(`New Listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

}