#!/usr/bin/env node
var fs=require('fs');
var restler=require('restler');
var program=require('commander');
var cheerio=require('cheerio');
var HTMLFILE_DEFAULT="index.html";
var CHECKSFILE_DEFAULT="checks.json";
var URL_DEFAULT="myurl";

var assertFileExists=function(infile) {
var instr=infile.toString();
if(!fs.existsSync(instr)) {
console.log("%s does not exist. Exiting.", instr);
process.exit(1);
}
return instr;
};

var cheerioHtmlFile=function(htmlfile) {
return cheerio.load(fs.readFileSync(htmlfile));
};
var loadChecks=function(checksfile) {
return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile=function(htmlfile, checksfile) {
$=cheerioHtmlFile(htmlfile);
var checks=loadChecks(checksfile).sort();
var out={};
for (var ii in checks) {
var present=$(checks[ii]).length>0;
out[checks[ii]]=present;
}
return out;
};
var clone = function (fn) {
return fn.bind({});
};
var download=function(url,callback) {
var resp=rest.get(url);
resp.on('complete',function(result) {
if (result instanceof Error) {
sys.puts('Error: '+result.message);
this.retry(5000);
return;
}
callback(null,result);
});
}

if (require.main==module) {
program
.option('-c,--checks <check_file>','Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
.option('-f,--file <html_file>','Path to index.html', clone (assertFileExists),HTMLFILE_DEFAULT)
.option('-u,--url <url>', 'Command Line defined URL')
.parse(process.argv);


function check(err,html) {
if (err) {
console.log('Error getting html: '+err);
process.exit(1);
}
var checks = loadChecks(program.checks);
var checkJson=checkHtml(html,checks);
var outJson = JSON.stringify(checkJson,null,4);
console.log(outJson);
}
if (program.url) {
download(program.url,check);
} else if (program.file) {
fs.readFile(program.file,check);
}

} else {
exports.checkHtmlFile=checkHtmlFile;
}
