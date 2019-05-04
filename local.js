const { runLocally } = require('./src/local_controller');

console.log('Running locally...');
runLocally().then(() => {
    console.log('Success!');
}).catch(ex => {
    console.log('Error!', ex);
});