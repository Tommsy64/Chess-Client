$.ajax({
            url : "http://api.wolframalpha.com/v2/query?input=pi&appid=4X5UTH-UJUPAJ68AA",//4X5UTH-UJUPAJ68AA is Tommsy64's All rights reserved
            type : "get",
            dataType : 'xml',
            success : function(data) {                                  
            	var xmpRaw = data;          
            },
            error : function() {
                console.log("WolframAlpha call failed");
            }                                   
        });

var xml = xmpRaw,
  xmlDoc = $.parseXML( xml ),
  $xml = $( xmlDoc ),
  $title = $xml.find( "title" );
 
// Append "RSS Title" to #someElement
$( "#someElement" ).append( $title.text() );
 
// Change the title to "XML Title"
$title.text( "XML Title" );
 
// Append "XML Title" to #anotherElement
$( "#anotherElement" ).append( $title.text() );