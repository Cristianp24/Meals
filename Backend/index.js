require("dotenv").config();
const server = require("./src/app.js");
const { conn } = require("./src/Other/dbConfig.js");
const PORT = process.env.PORT || 3001;




conn.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
    server.listen(PORT, () => {
      console.log ("Server is running on port", PORT);
    });
  }).catch(err => {
    console.error('Error during database sync:', err);
  });