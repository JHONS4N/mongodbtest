const {MongoClient}=require ('mongodb');

async function main (){
    //const uri ="mongodb+srv://S4NAdmin:S4NAdmin@s4ntest-dtujr.mongodb.net/test?retryWrites=true&w=majority";
    const uri =  "mongodb://0.0.0.0:27017/thepolyglotdeveloper";
    const client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology:true})
    try{
        await client.connect();
        await findOneListingByName(client,"sample_airbnb","listingsAndReviews","Infinite Views");
        /* await createListing(client,{
            name:"Lovely loft",
            summary:"A charming loft in Paris",
            bedrooms:1,
            bathrooms:1
            +
        }); 

        await createdMultipleListings(client,[
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

    }catch(e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}
main().catch(console.err);

async function findOneListingByName(client,dbname,nameOfcollection,nameOfListing){
    const result= await client.db(dbname).collection(nameOfcollection).findOne({name:nameOfListing});
    if(result){
console.log(`Found a listing in the collection with the name'${nameOfListing}':`);
console.log(result);
    }else{
        console.log(`No listing found with the name '${nameOfListing}'`)
    }
}

async function createdMultipleListings(client,newListings){
    const result =await  client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings)
console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
console.log(result.insertedIds)
}
async function createListing(client,newListing){
const result =await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
console.log(`New Listing created with the following id: ${result.insertedId}`);
}
async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

}