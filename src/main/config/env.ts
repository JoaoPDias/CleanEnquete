import dotenv from 'dotenv'

dotenv.config();
const Environment = require(`./env/${process.env.NODE_ENV}.ts`);
export default Environment.Environment