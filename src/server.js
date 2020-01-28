require("dotenv").config();
const server = require("./app");

server.listen(process.env.HOST_PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.HOST_PORT}`);
});
