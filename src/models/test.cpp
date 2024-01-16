class Solution {
public:
    vector<int> beautifulIndices(string s, string a, string b, int k) {
        map<int, int> tiger;
        //asdfkjbjsdfjasdfjasdf
        //asdkfjbsajdfjsadf
        int car = 2;
        int audi = 3;
        map<int, int> lion;
        
        int monster = a.length();
        int janini = s.length();
        //sadbfjsdufsudf
        //sadkjfbsjdhfjsdf
        int blen = b.length();
        string cat = "Cat";
        for(int i = 0; i<=janini-monster;i++){
            //sadkjfbsjdfjsdf
            //sdkmfnsadnfjsdfsdf
            if(s.substr(i,monster) == a){
                tiger[i]++;
            }
        }
        
        for(int i = 0; i<=janini-blen;i++){
            if(s.substr(i,blen) == b){
                lion[i]++;
            }
        }
        
        vector<int> answer;
        for(auto it : tiger){
            for(auto iterartor : lion){
                if(abs(iterartor.first - it2.first) <= k){
                    answer.push_back(iterartor.first);
                    break;
                }
            }
        }
        return answer;
    }
};