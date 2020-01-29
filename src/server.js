import "dotenv/config";
import app from "./app";

app.listen(process.env.HOST_PORT, () => {
  console.log(
    `Server is listening on http://localhost:${process.env.HOST_PORT}`
  );
});
