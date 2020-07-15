import {MongoHelper} from "../infra/db/mongodb/helpers/mongo-helper";
import Environment from "./config/env";

MongoHelper.connect(Environment.db)
    .then(async () => {
        const app = (await import('./config/app')).default
        app.listen(Environment.port, () => console.log(`Server running at http://localhost:${Environment.port}`))
    }).catch(console.error)
