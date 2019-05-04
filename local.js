const { runEverything } = require('./src/setup');

console.log('Running locally...');
runEverything().then(() => {
    console.log('Sucess!');
}).catch(ex => {
    console.log('Error!', ex);
});