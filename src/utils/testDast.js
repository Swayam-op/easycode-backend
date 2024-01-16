
const obj = {
    questionName : "Finding Prime Numbers in a Range",
    description : [
        "Given two integers L and R, inclusive, your task is to find and return all prime numbers in the range [L, R]. Write a function findPrimesInRange(L, R) that returns a list of prime numbers in ascending order.",
        "A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers. For example, 5 is a prime number because the only ways to write it as a product are 1 * 5 or 5 * 1."
    ],
    hiddenCode : ["#include <bits/stdc++.h>\n using namespace std;","int main() { int T; cin >> T; for (int t = 1; t <= T; t++) { int L, R; cin >> L >> R; vector<int> result = findPrimesInRange(L, R); for (int i = 0; i < result.size(); i++) { cout << result[i]; if (i < result.size()-1 ) { cout << \" \"; } } cout <<endl; } return 0; }"],
    recommendedCode : "vector<int> findPrimesInRange(int L, int R) {\n\n}",
    testCases : "2 2 10 15 30\n",
    testCasesToDisplay : ["2 10", "15 30"],
    expectedOutputOfTestCases : "2 3 5 7\n17 19 23 29\n",
    expectedOutputOfTestCasesToDisplay : ["2 3 5 7","17 19 23 29",""],
    hiddenTestCases : "5 1 10 11 20 21 28 13 15 20 20\n",
    hiddenTestCasesToDisplay : ["1 10", "11 20", "21 28", "13 15", "20 20"],
    expectedOutputOfHiddenTestCases : "2 3 5 7\n11 13 17 19\n23\n13\n\n",
    expectedOutputOfHiddenTestCasesToDisplay : ["2 3 5 7","11 13 17 19","23","13","",""],
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
}

