function customPrint(htmlElementToPrint,options) {
    if (!htmlElementToPrint) {
        console.error('Element to print not found');
        return;
    }
    
    // Determine if we're dealing with Shadow DOM or regular DOM
    const elementToPrint = htmlElementToPrint.shadowRoot 
        ? htmlElementToPrint.shadowRoot.host 
        : htmlElementToPrint;
    
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.zIndex = '9999';
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Printing...';
    loadingText.style.color = 'white';
    loadingText.style.fontSize = '24px';
    loadingText.style.padding = '20px';
    loadingText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingText.style.borderRadius = '10px';
    
    loadingIndicator.appendChild(loadingText);
    document.body.appendChild(loadingIndicator);
    
    // Create a new element in the document to clone the content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = elementToPrint.offsetWidth + 'px';
    
    // If Shadow DOM, apply its styles
    if (htmlElementToPrint.shadowRoot) {
        const shadowRootStyles = htmlElementToPrint.shadowRoot.querySelector('style')?.textContent;
        if (shadowRootStyles) {
            const styleElement = document.createElement('style');
            styleElement.textContent = shadowRootStyles;
            tempContainer.appendChild(styleElement);
        }
    }
    
    // Clone the content
    const clonedContent = elementToPrint.cloneNode(true);
    tempContainer.appendChild(clonedContent);
    
    // Add to document temporarily (needed for html2canvas to work)
    document.body.appendChild(tempContainer);
    
    // Capture with html2canvas
    html2canvas(clonedContent, options?options:{
        allowTaint: true,
        useCORS: true,
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
      // Remove the temporary container and loading indicator
      document.body.removeChild(tempContainer);
      document.body.removeChild(loadingIndicator);
      
      // Convert canvas to image
      const img = canvas.toDataURL('image/png');
      
      // Create a hidden iframe for printing (instead of opening a new tab)
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      
      // Append the iframe to the document
      document.body.appendChild(printFrame);
      
      // Write content to the iframe
      printFrame.contentDocument.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Report Print View</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            
            .canvas-printing-image {
              max-width: 100%;
              height: auto;
            }
            
            @media print {
              @page {
                margin: 0.5cm;
              }
            }
          </style>
        </head>
        <body>
          <img src="${img}" alt="Image to print" class="canvas-printing-image" />
          <script>
            // Print the document as soon as image is loaded
            document.querySelector('.canvas-printing-image').onload = function() {
              window.print();
              // Give some time for the print dialog to appear before cleaning up
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 100);
            };
          </script>
        </body>
        </html>
      `);
      
      printFrame.contentDocument.close();
      
    }).catch(error => {
      // Remove the temporary elements
      document.body.removeChild(tempContainer);
      document.body.removeChild(loadingIndicator);
      
      console.error('Error generating report image:', error);
      alert('There was an error preparing the report for printing. Please try again.');
    });
}