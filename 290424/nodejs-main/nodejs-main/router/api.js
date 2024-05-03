const express = require('express');
const router = express.Router();
//const fileUpload = require('express-fileupload');
const uploadOpts = {
    useTempFiles : true,
    tempFileDir : '/temp/'
}

const uploadcpfile = {
    useTempFiles : true,
    tempFileDir : '/temp/'
}

const XLSX = require('xlsx');
const fs = require('fs');
const pool = require('../util/database');
const csv = require('csv-parser');
const csvtojson = require('csvtojson');
const db = require("../modules/Db");
/*----------------------------------------------------*/
const databaseController = require('../controllers/databaseController');
const processorController = require('../controllers/processorController/credorexController');
const filesController = require('../controllers/filesController');
const apiController = require('../controllers/apiController');
const fileUpload = require('express-fileupload');
const database = require('../util/database');
/*----------------------------------------------------*/
//********* Create table ********/
router.get('/processor/credorax/creatcredorextbl', processorController.createTbl_credorex);
router.get('/processor/credorax/createcptbl', processorController.createTbl_cp);
router.get('/processor/credorax/createreconcredorex', processorController.createTbl_recon_credorex)
router.get('/processor/credorax/createcredorexindex',processorController.createTbl_credorex_index);
//********* Delete table ********/
router.delete('/processor/credorax/deletcredorextbl', processorController.deleteTbl_credorex);
router.delete('/processor/credorax/deletecptbl', processorController.deleteTbl_cp);
router.delete('/processor/credorax/deletereconcredorex', processorController.deleteTbl_recon_credorex);
router.delete('/processor/credorax/deletecredorexindex',processorController.deleteTbl_credorex_index);


//********* Upload Data *********/
router.post('/processor/credorax/uploadcredorex',fileUpload(uploadOpts), filesController.uploadprocessorcredorax);
router.post('/processor/credorax/uploadcpcredorex',fileUpload(uploadcpfile),filesController.uploadcpcredorax);

//********* Reconciliation ***********/
router.get('/processor/credorax/reconcredorex',processorController.reconciliation_credorex);
router.get('/processor/credorax/getreconcredorex',processorController.get_reconcilitaion_credorex);
router.delete('/processor/credorax/deleteallreconcredorex',processorController.deleteAllData_recon_credorex);

//*********** credorex *************** */
router.delete('/processor/credorax/deleteallcredorex',processorController.deleteAllData_credorex);
router.delete('/processor/credorax/deleteallcpcredorex',processorController.deleteAllData_cp_credorex);
router.delete('/processor/credorax/deleteallcredorexindex',processorController.deleteAllData_credorex_index);
router.delete('/processor/credorax/deleterowreconcredorex/:id',processorController.deleteRow_recon_credorex);
router.delete('/processor/credorax/deleterowreconcredorexauto',processorController.deleteRow_recon_credorex_auto);
router.delete('/processor/credorax/deletesamecredorax', processorController.delete_same_credorax);
//************ Checkout API *******************/
router.get('/getcheckoutpayment',apiController.checkoutAPI);

/******************** Searching credorex ********************/
router.get('/processor/credorax/searchcredorexprocessor/:item',processorController.searching_processor_recon_credorex_processor);
router.get('/processor/credorax/searchcredorexsystem/:item',processorController.searching_processor_recon_credorex_system);

/******************** Get with date *************************/
router.get('/processor/credorax/getrecondate/:date',processorController.get_reconciliation_credorex_dateCondition);

/******************** Register *******************************/
router.post('/processor/credorax/postregister',processorController.register_credorex_index);
router.get('/processor/credorax/getpayments',processorController.get_payment_index);
router.get('/processor/credorax/getsumpayments',processorController.get_sum_payment);
router.get('/processor/credorax/getsumfees', processorController.get_sum_fees)

/*-----------------------------------------------------*/
module.exports = router;