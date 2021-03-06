require("dotenv").config();

const config = {
    ACCOUNT: process.env.ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    ACCOUNT_NOTIFCATIONS_EMAIL: process.env.ACCOUNT_NOTIFCATIONS_EMAIL,
    REGION: process.env.REGION || process.env.CDK_DEFAULT_REGION,
};

export default config;
