const http = require("http");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const port = argv.port || 3000;

let home;
let project;
let registration;

fs.readFile('home.html', (err, data) => {
    if (err) {
        throw err;
    }
    home = data;
});
let x = 0;
let i = 0;
while(x!=10){
    console.log(i);
    i++;
}
fs.readFile('project.html', (err, data1) => {
    if (err) {
        throw err;
    }
    project = data1;
});

fs.readFile('registration.html', (err, data2) => {
    if (err) {
        throw err;
    }
    registration = data2;
});

const server = http.createServer((req, res) => {
    let url = req.url;
    res.writeHead(200, { "Content-Type": "text/html" });
    switch (url) {
        case "/project":
            res.write(project);
            break;
        case "/registration":
            res.write(registration);
            break;
        default:
            res.write(home);
            break;
    }
    res.end();
});

server.listen(port, () => {
    console.log("gekllo")
    console.log(`Server is running on port ${port}`);
});
