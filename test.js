int main() {
    int T;
    cin >> T;
    while (T--) {
        double x;
        int n;
        cin>>x>>n;
        double result = doPow(x,n);
        cout << result<< endl;
    }
    return 0;
}
