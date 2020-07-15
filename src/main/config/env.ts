import dotenv from 'dotenv'

dotenv.config();
let Environment
if (process.env.NODE_ENV === 'test') {
    Environment = require(`./env/development.ts`);
} else {
    Environment = require(`./env/${process.env.NODE_ENV}.ts`);
}
export default Environment.Environment