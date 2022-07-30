const express = require("express");

const app = express();
const port = 3000;

//routes
//default route
app.get("/", (req, res) => {
  res.send("Working!");
});

app.listen(port, () => {
  console.log(`listening on local port ${port}`);
});
