var SCALE = 1.3;
var NUM_PAGE = 1;
var HEIGHT = 950;
var WIDTH = 1150;

//get the PDF selected by the user and display it on the screen
document.getElementById("uploadPDF").addEventListener("change", function(e) {
    var file = e.target.files[0]
    if(file.type != "application/pdf") {
        console.error(file.name, "is not a pdf file.")
        return
    }
    var fileReader = new FileReader();  

    fileReader.onload = function() {
        var typedarray = new Uint8Array(this.result);
        
        PDFJS.getDocument(typedarray).then(function(pdf) {
            GeneratePDF(NUM_PAGE);

            //called everytime a new page is switched to
            function GeneratePDF(NUM_PAGE) {
                pdf.getPage(NUM_PAGE).then(function(page) {
                  var viewport = page.getViewport(SCALE);
                  var canvas = document.getElementById("canvas");  
                  canvas.height = HEIGHT;
                  canvas.width = WIDTH;

                page.render({
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport
                });
            });
            document.getElementById('pagenum').innerHTML = NUM_PAGE;  
            
        }

        //changes PDF to the previous page
        function PrevPage() {
            if(NUM_PAGE === 1) {
                return
            }
            NUM_PAGE--;
            GeneratePDF(NUM_PAGE);
        }

        //changes PDF to the next page
        function NextPage() {
            if(NUM_PAGE >= pdf.numPages) {
                return
            }
            NUM_PAGE++;
            GeneratePDF(NUM_PAGE);
        }

        //add next and prev functionality to buttons
        document.getElementById('prev').addEventListener('click', PrevPage);
        document.getElementById('next').addEventListener('click', NextPage);
        });
    };
    fileReader.readAsArrayBuffer(file);
})