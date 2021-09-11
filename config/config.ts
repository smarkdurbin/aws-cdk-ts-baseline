require("dotenv").config();

const config = {
    ACCOUNT: process.env.ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    REGION: process.env.REGION || process.env.CDK_DEFAULT_REGION,
};

export default config;
