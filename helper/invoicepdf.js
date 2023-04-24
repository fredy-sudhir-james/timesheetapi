//Required package
const pdf  = require( 'dynamic-html-pdf' );
const fs   = require( 'fs' );
const path = require( 'path' );

// Read HTML Template
const html = fs.readFileSync( "./helper/template.html", "utf8" );

const generatePdf = async ( args ) => {
	const options = {
		format: "A4",
		orientation: "portrait",
		border: "10mm"
	};
	let fileName = `invoice-${args.invoiceNo}.pdf`;
	let filePath = path.join(process.cwd(), 'public/invoices/', fileName);
	const document = {
		template: html,
		context: {
			invoice: args,
		},
		path: filePath,
		type: "file",
	};

	try {
		const res = await pdf.create(document, options);
		return { success: true, response: res, fileName: fileName };
	} catch (error) {
		return { success: false, response: error, fileName: '' };
	}

}

module.exports = generatePdf;
