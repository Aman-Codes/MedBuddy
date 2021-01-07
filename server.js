const app = require('./app');
const { Port } = require('./config/config');

app.listen(Port, () => {
  console.log(`Server running on Port ${Port}`);
});
