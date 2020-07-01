export const Environment = {
    sessionSecret: "senhaDevel",
    port: process.env.PORT || 5050,
    db: process.env.DB_CONNECTIONSTRING || "mongodb://localhost:27017/cleanSurvey",
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {session: false},
    jwtExpiresIn: {expiresIn: 36000}
};