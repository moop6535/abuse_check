/*
// AbuseIpDb check
// by Moop
*/

var casper = require('casper').create( {
    verbose: true
});

var input = casper.cli.get(0);

if(!casper.cli.has(0)) {
    console.log("Usage: casperjs abuse_check.js [file with ip(s)]");
    casper.exit();
}

var fs = require('fs');
var file_h = fs.open(casper.cli.get(0), 'r');
var lines = new Array;
var badIp = [];
var baseIP = [];

var counter = 0;

while(!file_h.atEnd()) {
    lines.push(file_h.readLine()); 
}

var upTo = lines.length;
var value = new Array;

var currentIP = 0;
var abuseCount = 0;

function compareSecondColumn(a, b) {
    if (a.abuse === b.abuse) {
        return 0;
    }
    else {
        return (a.abuse < b.abuse) ? -1 : 1;
    }
}


function abuse(ip) {
    casper.wait(75, function() {
            var results = this.getPageContent();
            if(results.indexOf("was not found in our database") !=-1 || results.indexOf("bingbot") !=-1) {
                if(casper.cli.get("show") == 'all') {
                    console.log("\n" + ip + ": ALL CLEAR!");
                }
            }
            else {                
                var number =  this.fetchText('body > div > div > div > div > div > section > div > div > div > p > b');
                var whois = this.fetchText('body > div > div > div > div > div > section > div > div > div > table > tbody > tr > td');
                if(casper.cli.get("show") == 'abuse' || casper.cli.get("show") == 'all') {
                    console.log("\nABUSE DETECTED!!!");
                    this.echo("IP: " + ip + "\n" + "Abuse Reports: " + number + " \n" + whois);
                }
                abuseCount++;
                baseIP.push(ip);
                if(ip.length === 10) {
                    badIp.push({ip:ip + "      |  Abuse Reports: ", abuse: +number});
                }
                else if (ip.length === 11) {
                    badIp.push({ip:ip + "     |  Abuse Reports: ", abuse: +number});
                }
                else if (ip.length === 12) {
                    badIp.push({ip:ip + "    |  Abuse Reports: ", abuse: +number});
                } 
                else if (ip.length === 13) {
                    badIp.push({ip:ip + "   |  Abuse Reports: ", abuse: +number});
                } 
                else if (ip.length === 14) {
                    badIp.push({ip:ip + "  |  Abuse Reports: ", abuse: +number});
                } 
                 else if (ip.length === 15) {
                    badIp.push({ip:ip + " |  Abuse Reports: ", abuse: +number});
                }                    
             }

             if(!casper.cli.get("show") == 'abuse' || !casper.cli.get("show") == 'all' || casper.cli.get("show") == 'list' || !casper.cli.has("show")) {
                
                if(lines.length > 500) {
                    if(counter % 50 == 0) {
                        value.push('#');
                        console.log.apply(console, value);                         
                    }
                }
                else if(lines.length > 200) {
                    if(counter % 20 == 0) {
                        value.push('#');
                        console.log.apply(console, value);                         
                    }
                }
                else {
                    if(counter % 10 == 0) {
                        value.push('#');
                        console.log.apply(console, value);  
                    }
                }
            }
            counter++;          
    });
}

function start(ip) {
    this.start('https://www.abuseipdb.com', function() {
        this.fill('form[action="/check/"]', { ip: ip }, true);
    });
}

function check() {
    if(currentIP < upTo) {
        start.call(this, lines[currentIP]);
        abuse.call(this, lines[currentIP]);
        currentIP++;
        this.run(check);
    }
    else {
        if(casper.cli.get("show") != 'list_only') {
            this.echo("\nFinished!");
            this.echo(abuseCount + " out of " + lines.length + " ip(s) have abuse reports");
            if(badIp.length != 0) {    
                badIp.sort(compareSecondColumn);
                this.echo("Bad IP(s):");
                for(i=0; i<badIp.length; i++) {
                    this.echo(badIp[i].ip + badIp[i].abuse); 
                }
                if(casper.cli.get("show") == 'list') {
                    this.echo("\n");
                    for(i=0; i<badIp.length; i++) {
                        this.echo(baseIP[i]);
                    }
                }
            }
            else {
                this.echo("ALL IP's CLEAR");
            }
        }
        else {
                for(i=0; i<badIp.length; i++) {
                    this.echo(baseIP[i]);
                }
            }

        file_h.close();
        this.exit();
    }
}

casper.start().then(function() {
    if(casper.cli.get("show") != 'list_only') {
        this.echo("Checking AbuseIpDb.com");
    }
});

casper.run(check);
