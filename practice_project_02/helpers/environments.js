/**
 * *Title: Environments
 * ?Description: all environments that are available.
 * @author: Faruk Sarkar
 * Date: 31/March/2023
 */

// dependencies

// module scaffolding
const environments = {};

// development environment
environments.development = {
    port: 3000,
    envName: 'development',
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
};

// determine which environments are passed
const currentEnvironments =    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'development';

// export corresponding environment object
const environmentToExport =    typeof environments[currentEnvironments] === 'object'
        ? environments[currentEnvironments]
        : environments.development;

module.exports = environmentToExport;
