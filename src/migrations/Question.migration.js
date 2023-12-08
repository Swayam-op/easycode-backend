import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";
import chalk from 'chalk';

configDotenv({path:'.env'});



const log = console.log;
chalk.level = 1; // Use colours in the VS Code Debug Window



const url = process.env.MONGODB_MIGRATION_URL;
const client = new MongoClient(url, {useNewUrlParser : true}); 
console.log(url);

async function connectToDb(){
    try{
        await client.connect();
        const database = client.db("EASYCODELIVE");
        return database;
    }
    catch(error){
        throw error;
    }
}
function closeConnection(){
     client.close();
}

// ------------------------------UPDATE ITEMS-----------------------------

const dataChanges = [
    {
        filter : {},
        update : {$set : {
            isDelete: false
        }}
    }
];
async function update(){  
    try{
        
        await client.connect();

        const database = client.db("EASYCODELIVE");
        const collection = database.collection("questions");
        
        let update_review;
        for(const change of dataChanges){
            update_review = await collection.updateMany(change.filter, change.update);
            
        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items updated : ${update_review.modifiedCount}`));
    }
    catch(err){
        log(chalk.red("Error during migration : ", err));
    }
    finally{
        client.close();
    }
}

// --------------------------------------INSERT ITEMS-------------------------

const new_entries = [{
    questionName : "Print Word",
    Description : "Write a code to take an input and print it.",
    testCases : {
        input : "Hello world of easy code",
        output : ["Hello world of easy code", "Hello world of easy code\n"]
    },
    hiddenTestCases : {
        input : "Hello world of easy code",
        output : ["Hello world of easy code", "Hello world of easy code\n"]
    },
    constraint : "",
    answer: "name=input()\nprint(name)",
    level : "easy",
    tags : ["easy", "print"],
    Author : "Swayam Prakash Sahoo",
    isDelete  :false
},
]
async function insert(){
    try{
        const database = await connectToDb();
        const collection = database.collection("questions");
        
        let count = 0;
        for(const entry of new_entries){
            await collection.insertOne(entry);
            count++;
        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items inserted : ${count}`));
    }
    catch(err){
        log(chalk.red("Error during migration : ", err));
    }
    finally{
        closeConnection();
    }
}

// ------------------------------ REMOVE ITEMS ---------------------------------

const fileterData = [
    {}
]
async function remove(){
    try{
        const database = await connectToDb();
        const collection = database.collection("questions");
        let removed_data;
        for(const filter of fileterData){
            removed_data = await collection.deleteMany(filter);
            
        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items removed : ${removed_data.deletedCount}`));
    }
    catch(err){
        log(chalk.red("Error during migration : ", err));
    }
    finally{
        closeConnection();
    }
}

update().catch((error)=>console.error("migration update failed : ",error));
// insert().catch((error)=>console.error("migration failed", error));
// remove().catch((error)=>{console.error("migration failed ", error)});