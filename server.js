const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");

dotenv.config({ path: "config/config.env" });

connectDatabase();

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`server is connected on this PORT ${PORT}`);
});
