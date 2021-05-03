'use strict';
const express = require('express');
let router = express.Router();
const fs = require('fs-extra');

router.get('/application/Listing', async (req, res) => {
	try {
		const filepath = 'routes/jsonFiles/applicationList.json';
		const applicationListingJson = await fs.readJsonSync(filepath);
		return res.send({ statusCode: 200, data: applicationListingJson });
	} catch (error) {
		res.send({ err: error, status: 500 });
	}
});

router.get('/application/detail/:applicationId', async (req, res) => {
	try {
		const filepath = 'routes/jsonFiles/application_' + req.params.applicationId + '.json';
		const applicationDetail = await fs.readJsonSync(filepath);
		return res.send({ statusCode: 200, data: applicationDetail });
	} catch (error) {
		res.send({ err: error, status: 500 });
	}
});

router.get('/application/image/:filename', async (req, res) => {
	try {
		const filepath = 'routes/jsonFiles/application_image_' + req.params.filename + '.b64';
		const applicationImage = await fs.readFile(filepath);
		const base64Version = Buffer.from(applicationImage, 'base64');
		res.writeHead(200, {
			'Content-Type': 'image/jpg',
			'Content-Length': base64Version.length,
		});
		res.end(base64Version);
	} catch (error) {
		res.send({ err: error, status: 500 });
	}
});

router.get('/application/document/detail/:documentName', async (req, res) => {
	try {
		const predict = await fs.pathExists('routes/jsonFiles/application_predict_' + req.params.documentName + '.json');
		if (predict) {
			const predictData = await fs.readJSONSync(
				'routes/jsonFiles/application_predict_' + req.params.documentName + '.json'
			);
			return res.send({ statusCode: 200, data: predictData });
		} else {
			// check for ocr file
			const ocr = await fs.pathExists('routes/jsonFiles/application_ocr_' + req.params.documentName + '.json');
			if (ocr) {
				const ocrData = await fs.readJSONSync('routes/jsonFiles/application_ocr_' + req.params.documentName + '.json');
				return res.send({ statusCode: 200, data: ocr });
			} else {
				return res.send({ statusCode: 200, data: 'sorry neither OCR OR PREDCT data exist!!' });
			}
		}
	} catch (error) {
		res.send({ err: error, status: 500 });
	}
});

module.exports = router;
