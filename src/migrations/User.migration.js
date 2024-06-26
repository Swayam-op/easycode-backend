import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";
import chalk from 'chalk';

configDotenv({ path: '.env' });



const log = console.log;
chalk.level = 1; // Use colours in the VS Code Debug Window



const url = process.env.MONGODB_MIGRATION_URL;
const client = new MongoClient(url, { useNewUrlParser: true });
console.log(url);

async function connectToDb() {
    try {
        await client.connect();
        const database = client.db("EASYCODELIVE");
        return database;
    }
    catch (error) {
        throw error;
    }
}
function closeConnection() {
    client.close();
}


const dataChanges = [
    {
        filter: {
           
        },
        update: {
            $set: {
                // username : "nm_volte",
                // password : "dhfjefkanfekj23j4u294r",
                // email: "nm@gmail.com",
                profilepicture : "https://wallpapers.com/images/high/naruto-pictures-qmc3mjl3e42475o4.webp",
                // fullname : "NM baibhab",
                bio : "I am a MERN Stack developer focusing on solving competitive questions and making a good rank. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, nisi.",
                // location : "Badamba, Odisha, India",
                linkdin :  "https://linkedin.com/nm"
                ,
                portfolio : "https://swayam-op.web.app", // 
                college : "Gandhi Institute For Technology", //
                company : "Delta X", // 
                github : "https://github.com/nm"
                , // {name , url}
                twitter : "https://twitter.com/nm"
                , // {name , url}
                languagepreference : "C++",
                proficientin : ["node", "react", "Java script", "Python", "Docker", "AWS", "SQL", "Mongodb", "Nungurami"],
                codinglevel : "beginner",
                // accesstoken: "",
                // refreshtoken: "",
                // badges: ["itachi", "kakashi", "naruto"],
                // contesthistory : [],
                // useractivitylogs : [],
                // isDelete: false
            }
        }
    }
];

async function migrattion_update() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {

        await client.connect();

        const database = client.db("EASYCODELIVE");
        const collection = database.collection("users");

        let update_review;
        for (const change of dataChanges) {
            update_review = await collection.updateMany(change.filter, change.update);

        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items updated : ${update_review.modifiedCount}`));
    }
    catch (err) {
        log(chalk.red("Error during migration : ", err));
    }
    finally {
        client.close();
    }
}


const new_entries = [{
    username: "swayam",
    password: "dhfjefkanfekj23j4u294r",
    email: "swayam@gmail.com",
    profilepicture: "",
    fullname: "swayam prakash sahoo",
    bio: "I am an uchiha",
    location: "Leaf village",
    linkdin : {
        name : "swayamprakash",
        url  : "https//:linkedin.com/swayam"
    }, 
    portfolio : "swayam-op.web.app", 
    college : "Gandhi institute For Technology", 
    company : "Coforge",  
    github : {
        name : "swayam_op",
        url : "https//:linkedin.com/swayam"
    }, 
    twitter : {
        name : "swayam_op",
        url : "https//:linkedin.com/swayam"
    },
    languagepreference: "c++",
    proficientin: ["node", "react"],
    codinglevel: "beginner",
    accesstoken: "",
    refreshtoken: "",
    badges: [],
    contesthistory: [],
    useractivitylogs: [],
    isDelete: false
},
]
async function migrattion_insert() {
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        await client.connect();

        const database = client.db("EASYCODELIVE");
        const collection = database.collection("users");

        let count = 0;
        for (const entry of new_entries) {
            await collection.insertOne(entry);
            count++;
        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items inserted : ${count}`));
    }
    catch (err) {
        log(chalk.red("Error during migration : ", err));
    }
    finally {
        client.close();
    }
}


// ------------------------------ REMOVE ITEMS ---------------------------------

const fileterData = [
    {}
]
async function remove() {
    try {
        const database = await connectToDb();
        const collection = database.collection("users");
        let removed_data;
        for (const filter of fileterData) {
            removed_data = await collection.deleteMany(filter);

        }
        log(chalk.green("Data migration completed."));
        log(chalk.yellow(`No. of items removed : ${removed_data.deletedCount}`));
    }
    catch (err) {
        log(chalk.red("Error during migration : ", err));
    }
    finally {
        closeConnection();
    }
}


migrattion_update().catch((error)=>console.error("migration update failed : ",error));
// migrattion_insert().catch(()=>console.error("migration failed"));
// remove().catch((error) => { console.error("migration failed ", error) });