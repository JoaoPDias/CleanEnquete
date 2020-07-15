import dotenv from 'dotenv'

dotenv.config();
let Environment
if (process.env.NODE_ENV === 'test') {
    Environment = require(`./env/development`);
} else {
    Environment = require(`./env/${process.env.NODE_ENV}`);
}
export default Environment.Environment