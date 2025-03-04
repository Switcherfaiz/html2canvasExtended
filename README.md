# HTML2Canvas Custom Print Extension

This is an extension of the popular [html2canvas](https://github.com/niklasvh/html2canvas) library, which can be downloaded from [github.com/niklasvh/html2canvas](https://github.com/niklasvh/html2canvas) or [html2canvas.hertzen.com](https://html2canvas.hertzen.com/). The original html2canvas library allows you to take "screenshots" of webpages or parts of it, directly on the client-side.

This extension, modified by Switcherfaiz, enhances the original library with a custom printing functionality that simplifies the process of capturing and printing HTML elements.

## Installation

1. Download the original html2canvas library from [github.com/niklasvh/html2canvas](https://github.com/niklasvh/html2canvas)
2. Copy the html2canvas files to your project folder
3. Add the custom initializer.js file to your html2canvas folder

## Including the Scripts

Include both the original html2canvas library and the custom initializer in your HTML file:

```html
<!-- Import html2canvas library -->
<script src="/html2canvas/dist/html2canvas.min.js"></script>
<!-- Import the custom print extension -->
<script src="/html2canvas/initializer.js"></script>
```

Make sure the paths match your project structure. The example above assumes you have placed the html2canvas folder in your public directory.

## Usage

The `customPrint()` function provides an easy way to capture and print HTML elements, including those with Shadow DOM.

### Basic Usage

```javascript
// Get the element you want to print
const elementToPrint = document.getElementById('myElement');

// Call the customPrint function
customPrint(elementToPrint);
```

### With Custom Options

You can pass html2canvas options as a second parameter:

```javascript
customPrint(elementToPrint, {
  scale: 3,                // Higher resolution
  backgroundColor: '#fff', // White background
  logging: true,           // Enable logging
  allowTaint: true,        // Allow cross-origin images
  useCORS: true            // Try to load cross-origin images as CORS
});
```

### Features

- Supports both regular DOM and Shadow DOM elements
- Shows a loading indicator during processing
- Automatically handles printing through a hidden iframe
- High-quality image rendering with customizable options
- Clean error handling

## Shadow DOM and Custom Elements Support

This extension has been specifically enhanced to work with Shadow DOM and custom HTML elements. It can:

- Properly capture and print elements inside Shadow DOM
- Preserve styles defined within Shadow DOM
- Handle custom elements with encapsulated styles and structure
- Maintain the visual appearance of complex custom components

This makes it particularly useful for applications built with Web Components or modern frameworks that utilize Shadow DOM for style encapsulation.

### Example with Shadow DOM

```javascript
// Print a custom element with Shadow DOM
const myCustomElement = document.querySelector('my-custom-element');
customPrint(myCustomElement);
```

## Example

```javascript
// Print a report component
document.getElementById('printButton').addEventListener('click', function() {
  const reportElement = document.querySelector('.report-container');
  customPrint(reportElement);
});
```

## How It Works

1. The function creates a temporary clone of your element
2. It captures the element using html2canvas
3. A loading indicator is displayed during processing
4. The captured content is converted to an image
5. The image is loaded into a hidden iframe with print styling
6. The print dialog is automatically triggered
7. The iframe is removed after printing

This approach ensures that your printed output looks exactly like what you see on screen, regardless of complex styling or dynamic content.
