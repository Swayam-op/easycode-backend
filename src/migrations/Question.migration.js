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
    questionName : "Pow(x, n)",
    description : [
        "Implement pow(x, n), which calculates x raised to the power n (i.e., xn)."
     ],
    questionNo : 3,
    hiddenCode : ["#include <bits/stdc++.h>\n using namespace std;",'int main() { int T; cin >> T; while (T--) { double x; int n; cin>>x>>n; double result = doPow(x,n); cout << result<< endl; } return 0; }'],
    recommendedCode : "double doPow(double x, int n){\n\n}",
    testCases : "3 2.0 10 2.1 3 2.0 -2\n",
    testCasesToDisplay : ["x = 2.0, n = 10", "x = 2.10, n = 3","x = 2.0, n = -2"],
    expectedOutputOfTestCases : "1024\n9.261\n0.25\n",
    expectedOutputOfTestCasesToDisplay : ["1024", "9.261", "0.25"],
    hiddenTestCases : "5 2.0 10 2.10 3 2.0 -2 -3.5 2 -4.0 5\n",
    hiddenTestCasesToDisplay : ["x = 2.0, n = 10", "x = 2.1, n = 3", "2.0, n = -2","x = -3.5, n = 2", "x = -4.0, n = 5"],
    expectedOutputOfHiddenTestCases : "1024\n9.261\n0.25\n12.25\n-1024\n",
    expectedOutputOfHiddenTestCasesToDisplay : ["1024","9.261","0.25","12.25","-1024"],
    examples : [
        {
            input: "x = 2.0, n = 10",
            output: "1024.0",
            explanation: "2 raised to the power of 10 equals 1024."
        },
        {
            "input": "x = 2.1, n = 3",
            "output": "9.261",
            "explanation": "2.1 raised to the power of 3 equals approximately 9.261."
        }
        ,
        {
            "input": "x = 2.0, n = -2",
            "output": "0.25",
            "explanation": "2 raised to the power of -2 equals 1 divided by 2 squared, which is 1/4, or 0.25."
        }
        
    ],
    constraint : [
        "-100.0 < x < 100.0",
        "-231 <= n <= 231-1",
        "n is an integer.",
        "Either x is not zero or n > 0",
        "-104 <= xn <= 104"
    ],
    answer : 'long long tn = n < 0 ? n*-1ll : n; double ans = 1.0; while(tn > 0){ if(tn%2){ ans = ans * x; tn--; } else{ x = x*x; tn = tn/2; } } if(n < 0){ return (double)1.0/(double)ans; } return ans;',
    level : "medium",
    Tags : "recursion",
    Author : "Swayam uchiha",
    isDelete : false
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

// update().catch((error)=>console.error("migration update failed : ",error));
insert().catch((error)=>console.error("migration failed", error));
// remove().catch((error)=>{console.error("migration failed ", error)});