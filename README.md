# abuse_check
A quick Phantom/CasperJS script I wrote to help me automate checking IPs against AbuseIPDB.com. 

My first real crack at JS browser automation, so be gentle and if there is something you really don't like feel free to do with it as you wish! 

##Prerequisites:

[PhantomJS](http://phantomjs.org/download.html)

[CasperJS](http://docs.casperjs.org/en/latest/installation.html)


##Usage:
```casperjs abuse_check.js [ip list file]```

##Extra Argument:
```--show=OPTION   Change verbosity. OPTIONS are 'abuse' -- 'all' -- 'list' & 'list_only'```

##example:

```casperjs abuse_check.js list_of_ip.txt --show=abuse```

```casperjs abuse_check.js list_of_ip.txt --show=list_only > ip_file_list.txt``` 

##NOTE
IP file should have only 1 IP per line

I would not recommend doing more than 500 IP's at a time!