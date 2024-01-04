const fs = require("fs");
const http = require("http");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let htmlBody = tempVal.replace("{{CITY_NAME}}", orgVal.name);
        htmlBody = htmlBody.replace("{{COUNTRY_CODE}}", orgVal.sys.country);
        htmlBody = htmlBody.replace("{{TEMPREATURE}}", orgVal.main.temp);
        htmlBody = htmlBody.replace("{{MIN_TEMP}}", orgVal.main.temp_min);
        htmlBody = htmlBody.replace("{{MAX_TEMP}}", orgVal.main.temp_max);
        htmlBody = htmlBody.replace("{{WEATHER_STATUS}}", orgVal.weather[0].main);
        return htmlBody;
}
const server = http.createServer((request, response) => {
    if (request.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=898f49481d9922780a156fc4518c4ffa')
            .on('data', function (chunk) {

                const objData = JSON.parse(chunk);
                const arrData = [objData];

                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                response.write(realTimeData);
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                response.end();
            });
    }
})

server.listen(8000, (error) => {
    if (error) console.log("Connection ends");
});
