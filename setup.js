const { setup } = require('./src/admin');

console.log('Running locally...');
setup().then(() => {
    console.log('Success!');
}).catch(ex => {
    console.log('Error!', ex);
});