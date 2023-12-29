const http = require("http");

// const revision = require("child_process")
//   .execSync("git rev-parse HEAD")
//   .toString()
//   .trim()
//   .slice(7);

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ commit: "unknown" }));
    res.end();
  })

  .listen(3000, "0.0.0.0");

console.log("Dev service ready!");
