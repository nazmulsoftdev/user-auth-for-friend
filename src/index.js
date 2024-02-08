import * as dotenv from "dotenv";
import app from "./app.js";
import DatabaseConnections from "../config/db.js";
dotenv.config({
  path: `.env`,
});

// create connection to database

DatabaseConnections()
  .then(() => {
    app.listen(process.env.PORT || 9000, () => {
      console.log(`Server start on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("OOPs something went wrong !");
  });
