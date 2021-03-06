/*
Author: Prateek
Description:    This is a casperjs automated test script for showing that If the cursor is placed anywhere in between the content of a cell,
then the entire content present after the cursor gets pushed to a newly created cell immediately beneath the existing cell
*/
    
//Begin Tests
    
casper.test.begin("Split cells when cursor anywhere in between the code", 6, function suite(test) {
	var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var input_code1 = '"Pioneer"';
    var input_code2 = '"Discover"';
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;
    
    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
    });
    
    casper.wait(10000);
    
    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });
    
    casper.viewport(1024, 768).then(function () {
		this.wait(9000);
		console.log("validating that the Main page has got loaded properly by detecting \n\
     if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
		functions.validation(casper);
    });
    
    //Add new notebook
    casper.then(function(){
		functions.create_notebook(casper);
		this.wait(5000);
    });
        
    // Add contents to cell
	casper.then(function(){
		functions.addnewcell(casper);
		functions.addcontentstocell(casper,input_code1);
    });

    //adding new cell
    casper.then(function(){
		this.click(x(".//*[@id='prompt-area']/div[1]/div/span/i"));
        console.log("creating one more cell");
	});
        
    // Add contents to cell
    casper.wait(2000).then(function(){
		this.sendKeys(x(".//*[@id='part2.R']/div[3]/div[1]/div[2]/div/div[2]/div"), input_code2 );
        this.wait(7000);
        this.echo("adding contents to second cell");
	});
    
    casper.then(function () {
		var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        this.echo("clicking on toggle edit button");
    });
    
    // clicking on coalesce icon
    casper.then(function () {
		this.wait(7000);
        this.click(x(".//*[@id='part2.R']/div[1]/span[2]/i"));
        this.wait(5000);
        this.echo("joining two cells");
    });
    
     //clicking split icon
	casper.then(function () {
		var z = casper.evaluate(function () {
        $('.icon-unlink').click();
        this.echo("clicking on split icon");
        this.wait(5000);
        });    
	});
	
	//Verifying the split cell is present or not
	casper.wait(3000).then(function(){
		this.test.assertSelectorHasText(x(".//*[@id='part2.R']/div[3]/div[1]/div[1]/pre/code/span[2]"), input_code2,'Second cell consists the contents');
		this.echo('second cell is present after splitting');
	});	
		
	casper.run(function () {
		test.done();
	});
    
});
    
