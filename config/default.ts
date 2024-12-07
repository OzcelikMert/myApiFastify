export default {
    runType: "dev",
    SSLKey: "",
    SSLCert: "",
    serverProtocol: "http",
    serverPort: 5001,
    serverTrafficMBLimit: 2,
    dbProtocol: "mongodb",
    dbHost: "192.168.1.10",
    dbHostParams: "",
    dbPort: 27017,
    dbName: "myadminpanel",
    dbUser: "admin",
    dbPassword: "_@QffsDh14Q",
    whiteList: [
        'http://localhost:3000',
        'http://localhost:3001',
    ]
}

/*
export default {
    runType: "production",
    SSLKey: "",
    SSLCert: "",
    serverProtocol: "http",
    serverPort: 5001,
    serverTrafficMBLimit: 2,
    dbProtocol: "mongodb+srv",
    dbHost: "cluster0.kvd0jll.mongodb.net",
    dbHostParams: "",
    dbPort: "",
    dbName: "myadminpanel",
    dbUser: "test",
    dbPassword: "_@QffsDh14Q",
    whiteList: [
        'http://localhost:3000',
        'http://localhost:3001',
    ]
}*/