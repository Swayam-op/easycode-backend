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
    questionName : "Finding Prime Numbers in a Range",
    description : [
        "Given two integers L and R, inclusive, your task is to find and return all prime numbers in the range [L, R]. Write a function findPrimesInRange(L, R) that returns a list of prime numbers in ascending order.",
        "A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers. For example, 5 is a prime number because the only ways to write it as a product are 1 * 5 or 5 * 1."
    ],
    questionNo : 1,
    hiddenCode : ["#include <bits/stdc++.h>\n using namespace std;","int main() { int T; cin >> T; for (int t = 1; t <= T; t++) { int L, R; cin >> L >> R; vector<int> result = findPrimesInRange(L, R); for (int i = 0; i < result.size(); i++) { cout << result[i]; if (i < result.size()-1 ) { cout << \" \"; } } cout <<endl; } return 0; }"],
    recommendedCode : "vector<int> findPrimesInRange(int L, int R) {\n\n}",
    testCases : "2 2 10 15 30\n",
    testCasesToDisplay : ["L = 2 , R = 10", "L = 15, R = 30"],
    expectedOutputOfTestCases : "2 3 5 7\n17 19 23 29\n",
    expectedOutputOfTestCasesToDisplay : ["2 3 5 7","17 19 23 29"],
    hiddenTestCases : "5 1 10 11 20 21 28 13 15 20 20\n",
    hiddenTestCasesToDisplay : ["L = 1, R = 10", "L = 11, R = 20", "L = 21, R = 28", "L = 13, R = 15", "L = 20, R = 20"],
    expectedOutputOfHiddenTestCases : "2 3 5 7\n11 13 17 19\n23\n13\n\n",
    expectedOutputOfHiddenTestCasesToDisplay : ["2 3 5 7","11 13 17 19","23","13",""],
    examples : [
        {
            input: "L = 2, R = 10",
            output: "[3, 5, 7]",
            explanation: "Prime numbers in the range [2, 10] are 3, 5, and 7."
        },
        {
            input: "L = 15, R = 30",
            output: "[17, 19, 23, 29]",
            explanation: "Prime numbers in the range [15, 30] are 17, 19, 23, and 29."
        }
    ],
    constraint : [
        "You are encouraged to optimize your solution for larger input ranges.",
        "(1 <= L <= R <= 10^6)"
    ],
    answer : 'const std::string code = "bool isPrime(int n) {\n    if (n <= 1) return false;\n    for (int i = 2; i * i <= n; ++i) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}\n\nvector<int> findPrimesInRange(int L, int R) {\n    vector<int> primes;\n    for (int i = L; i <= R; ++i) {\n        if (isPrime(i)) {\n            primes.push_back(i);\n        }\n    }\n    return primes;\n}";',
    level : "easy",
    Tags : "bruteforce",
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