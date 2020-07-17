import dotenv from 'dotenv'

dotenv.config();
export let Environment
if (process.env.NODE_ENV === 'test') {
    Environment = require(`./environments/development`);
} else {
    Environment = require(`./environments/${process.env.NODE_ENV}`);
}
export default Environment.Environment