const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/melbourne', {
    useNewUrlParser: true,
    useCreateIndex: true
}).catch((err) => {
    console.log('Error on start: ' + err.stack);
    process.exit(1);
  });