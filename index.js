/*eslint-env node */

var samiURL = "https://api.samsungsami.io/v1.1/messages";
var bearer = "Bearer INSERT_YOUR_DEVICE_TOKEN_HERE";
var device_id = "INSERT_YOUR_DEVICE_ID_HERE";
var fs = require('fs');
var Client = require('node-rest-client').Client;
var c = new Client();

function build_args (temp, ts) {
    var args = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": bearer 
        },  
        data: { 
	"sdid": device_id,
	"ts": ts,
	"type": "message",
	"data": {
	    "temperature": temp
	}
        }
    };
    return args;
}

/**
 * Send temperature data to SAMI
 */
function sendData(temperature){
    var args = build_args(temperature, new Date().valueOf());

    c.post(samiURL, args, function(data, response) {
         console.log(data);
    });
}

function readTemperature() {
    fs.readFile("/sys/devices/12d10000.adc/iio:device0/in_voltage7_raw", 'utf8',function(error, sensorVal) { 
        var voltage = sensorVal;
        voltage /= 1024.0;

        temperatureC = (voltage - 0.5) * 100;
        temperatureF = (temperatureC * 9.0 / 5.0) + 32.0;
        console.log(temperatureF);
   
        sendData(temperatureF);
     });
};

setInterval(function() {
    readTemperature();
}, 10000);