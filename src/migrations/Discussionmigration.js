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

const new_entries = [
    {
        title : "Code Discussion",
        description : "Share your tricks of coding or help others find their logics.",
        path_segment : "code-discussion"
    },
    {
        title : "Technology Discussion",
        description : "Share your tricks of coding or help others find their logics.",
        path_segment : "technology-discussion"
    },
    {
        title : "Interview Discussion",
        description : "Share your tricks of coding or help others find their logics.",
        path_segment : "interview-discussion"
    }
];
async function insert(){  
    try{
        
        await client.connect();

        const database = client.db("EASYCODELIVE");
        const collection = database.collection("discussions");
        
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
        client.close();
    }
}

insert().catch((error)=>console.error("Discussion insertion migration failed : ",error));