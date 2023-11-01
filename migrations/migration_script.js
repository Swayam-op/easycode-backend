import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";
import chalk from 'chalk';

configDotenv({path:'../.env'});



const log = console.log;
chalk.level = 1; // Use colours in the VS Code Debug Window



const url = process.env.MONGODB_URL;

const dataChanges = [
    {
        filter : {},
        update : {$set : {
            username : "swayam",
            password : "dhfjefkanfekj23j4u294r",
            email: "swayam@gmail.com",
            profilepicture : "",
            fullname : "swayam prakash sahoo",
            bio : "I am an uchiha",
            location : "Leaf village",
            socialmedialinks : ["swayam-op.web.app"],
            languagepreference : "c++",
            subscriptiontype : "",
            subscriptionstatus : 0,
            proficientin : ["node", "react"],
            codinglevel : "beginner",
            solvedproblems : {},
            recentactivity : [`account created ${Date.now}`],
            contributions: [],
            accesstoken: "",
            refreshtoken: "",
            badges: [],
            solutiontoproblems : [],
            contesthistory : [],
            useractivitylogs : []
        }}
    }
];

async function migrattion_update(){
    const client = new MongoClient(url, {useNewUrlParser : true});
    
    try{
        await client.connect();

        const database = client.db("EASYCODELIVE");
        const collection = database.collection("users");
        
        let count = 0;
        for(const change of dataChanges){
            await collection.updateOne(change.filter, change.update);
            count++;
        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items updated : ${count}`));
    }
    catch(err){
        log(chalk.red("Error during migration : ", err));
    }
    finally{
        client.close();
    }
}


const new_entries = [{
    username : "swayam",
    password : "dhfjefkanfekj23j4u294r",
    email: "swayam@gmail.com",
    profilepicture : "",
    fullname : "swayam prakash sahoo",
    bio : "I am an uchiha",
    location : "Leaf village",
    socialmedialinks : ["swayam-op.web.app"],
    languagepreference : "c++",
    subscriptiontype : "",
    subscriptionstatus : 0,
    proficientin : ["node", "react"],
    codinglevel : "beginner",
    solvedproblems : {},
    recentactivity : [`account created ${Date.now()}`],
    contributions: [],
    accesstoken: "",
    refreshtoken: "",
    badges: [],
    solutiontoproblems : [],
    contesthistory : [],
    useractivitylogs : []
},
]
async function migrattion_insert(){
    const client = new MongoClient(url, {useNewUrlParser : true});
    
    try{
        await client.connect();

        const database = client.db("EASYCODELIVE");
        const collection = database.collection("users");
        
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

// migrattion_update.catch(()=>console.error("migration failed"));
migrattion_insert().catch(()=>console.error("migration failed"));