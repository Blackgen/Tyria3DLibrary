#!/bin/env node
// NodeJS script to split and re-indent the output from the IDA script

var fs = require('fs');
var beautify = require('js-beautify').js_beautify;

const outputFolder = '../../src/format/chunks';
const inputFile = 'data/output.js';

//Automatically clean the output folder from previous output
function cleanAndGenerate(){
    fs.readdir(outputFolder, (err, files) => {
        if (err) throw err;
            
        for (const file of files) {
            // We keep it sync because we'll start generating data
            // as soon as it finished
            fs.unlinkSync(`${outputFolder}/${file}`);
        }
        
        generate();
    });
}

//Real split and beautify function
function generate(){
    fs.readFile(inputFile, (err, data) => {
        if (err) throw err;
        
        var formatArray = data.toString().split(
            "\t///==================================================\n" + 
            "\t/// Chunk: ").slice(1);
        
        // Keep the chunk names in this array
        var names = [];
        var chunkObject = {};
        for(chunk of formatArray){
            //Split the first characters until the first coma
            var header = chunk.split(',',1)[0];
            
            //Some chunks can appear many times, so we keep track of which we already saw
            if(!names.includes(header)){
                names.push(header);
                chunkObject[header] = "";
            } else {
                console.log("Found multiple time: ", header);
            }
            
            // Re-add what was cut by the chunk split
            chunkObject[header] += 
                "    ///================================================== \n" + 
                `    ///Chunk: ${chunk}`;
		}
	
        // Now generate the output
		for(chunkName of names){
			var chunk = chunkObject[chunkName];
            
            // Add the module.exports at the top
            chunk = 'module.exports = [ \n' + chunk;

            var endblock = chunk.lastIndexOf('}');
            // Remove the last coma
			if (chunk[endblock + 1 ] == ','){
				chunk = chunk.slice(0, endblock+1) + chunk.slice(endblock+2);
            }
            // And close the Array
            chunk += "]";
			
            //Write out to the outputFolder
			fs.writeFile(`${outputFolder}/${chunkName}.js`, 
                         //and beautify the chunks before writing them (fixing the ident)
                         beautify(chunk, { indent_size: 4 }), 
                         (err) => { if(err) throw err; }
            );
		}
	});	
}

cleanAndGenerate();
