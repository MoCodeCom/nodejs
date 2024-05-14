const pool = require('../util/database');
/*-------------------------------------------------*/

/*-------------------------------------------------*/
module.exports = class Data{
    constructor(){}
    save(){}
    /***************** Check exist table **************/
    //Check existing table
    static exist_Table(table_name) {
        const q = `SELECT EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'appdb' AND table_name = '${table_name}') AS tableExists`;
        return pool.query(q);
    }

    //Show tables in the database
    static tables_names(table_name){
        const q = `SHOW TABLES FROM appdb LIKE '${table_name}'`;
        return pool.query(q);
    }

    /***************** Check exist table **************/
    /*-----------------> check credorex table <---------------------------*/
    //to check the data in the table or not ...
    static exist_data_table(table_name,column_title,item){
        const q = `SELECT * FROM ${table_name} WHERE ${column_title} = '${item}';`;
        return pool.query(q);
    }


    /***************** Delete Table *******************/
    //to delete table from database
    static deleteTable(table_name){
        const q = `DROP TABLE ${table_name};`;
        return pool.query(q);
    }

    /***************** Cp ************************/

    //create table cp _ credorax
    static createTable_cp_credorax(){
        const q = "CREATE TABLE cp_credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }


    /***************** Credorx ************************/

    //Create credorex table
    static createTable_credorex(){
        const q = "CREATE TABLE credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(20),posting_date VARCHAR(20) ,transaction_currency VARCHAR(50),cs_settlement_currency VARCHAR(50)  ,transaction_amount VARCHAR(45),transaction_type VARCHAR(150) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(50),card_scheme_fees VARCHAR(50),acquiring_fee VARCHAR(50),net_activity VARCHAR(50),card_scheme VARCHAR(50), merchant_reference_number_h9 VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //Create credorex_index
    static createTable_credorex_index(){
        const q = "CREATE TABLE credorex_index (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(75),posting_date VARCHAR(75) ,transaction_currency VARCHAR(50),cs_settlement_currency VARCHAR(50) ,transaction_amount VARCHAR(45),transaction_type VARCHAR(150) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(50),card_scheme_fees VARCHAR(50),acquiring_fee VARCHAR(50),net_activity VARCHAR(50),card_scheme VARCHAR(50), merchant_reference_number_h9 VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    /************************ Reconcilitaion ************************/

    //Create recon_credorex table
    static createTable_recon_credorex(){
        const q = "CREATE TABLE recon_credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20),ID_system VARCHAR(20) ,ID_processor VARCHAR(20),amount_system VARCHAR(20),currency_system VARCHAR(10) ,amount_processor VARCHAR(20),currency_processor VARCHAR(10),status VARCHAR(10),posting_date_system VARCHAR(50),posting_date_processor VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //Insert data recon in the database
    static reconciliation_credorex(){
        const q1 = "INSERT INTO appdb.recon_credorex (statement_date,ID_system,amount_system,currency_system, posting_date_system) SELECT statement_date,merchant_reference_number_h9, transaction_amount,transaction_currency,posting_date FROM appdb.credorex LEFT JOIN appdb.cp_credorex ON appdb.cp_credorex.ID_trans = appdb.credorex.merchant_reference_number_h9 AND appdb.cp_credorex.Paid = appdb.credorex.transaction_amount AND appdb.cp_credorex.pCrn = appdb.credorex.transaction_currency WHERE appdb.cp_credorex.ID_trans IS NULL; ";
        const q2 = "INSERT INTO appdb.recon_credorex (statement_date,ID_processor,amount_processor,currency_processor, posting_date_processor) SELECT sDate,ID_trans,Paid,pCrn,rDate FROM appdb.cp_credorex LEFT JOIN appdb.credorex ON appdb.credorex.merchant_reference_number_h9 = appdb.cp_credorex.ID_trans AND appdb.credorex.transaction_amount = appdb.cp_credorex.Paid  AND appdb.credorex.transaction_currency = appdb.cp_credorex.pCrn WHERE appdb.credorex.merchant_reference_number_h9 IS NULL;";
        return pool.query(q1).then(()=>{
            pool.query(q2);
        });
    }

    static update_reconciliation_credoex(){
        const q1 = "DELETE FROM appdb.recon_credorex WHERE ID_system IN (SELECT ID_processor FROM appdb.recon_credorex WHERE ID_system IS NOT NULL AND ID_processor IS NOT NULL);";
        const q2 = "DELETE FROM appdb.recon_credorex WHERE ID_processor IN (SELECT ID_system FROM appdb.recon_credorex WHERE ID_system IS NOT NULL AND ID_processor IS NOT NULL);";
        return pool.query(q1).then(()=>{
            pool.query(q2);
        });
    }

    //Get recon data under condition
    static get_reconciliation_condition(table_name, condetion){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${condetion};`;
        return pool.query(q);
    }
    
    //Get recon data
    static get_reconciliation_credorex(){
        const q = "SELECT * FROM appdb.recon_credorex;";
        return pool.query(q);
    }

    //Delete recon row under condition
    static delete_row_reconciliation_credorex(table_name, condetion){
        const q = `DELETE FROM ${table_name} WHERE ${condetion}`;
        return pool.query(q); 
    };

    //Delete recon row when there are same data in the same column
    static delete_row_recon_same(table_name, column_name){
        //const q = `DELETE FROM ${table_name} WHERE id NOT IN (SELECT id FROM (SELECT MIN(id) AS id FROM ${table_name} GROUP BY ${column_name}) AS t)`;
        const q = `DELETE FROM appdb.${table_name} WHERE ID IN ( SELECT ID FROM(SELECT ID, ROW_NUMBER() OVER(PARTITION BY ${column_name} ORDER BY ID) AS row_num FROM appdb.${table_name} WHERE ${column_name} IS NOT NULL) AS t WHERE row_num > 1);`
        return pool.query(q);
    }


    /************************ Get Data from database ************************/
    static register_in_table(table_name, table_source,columns){
        if(table_source === 'credorex'){
            
            const q = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}, ${columns[11]},${columns[12]}, ${columns[13]},${columns[14]}) SELECT statement_date, transaction_date,posting_date,transaction_currency,cs_settlement_currency,transaction_amount,transaction_type,fixed_transaction_fee,discount_rate,interchange,card_scheme_fees,acquiring_fee,net_activity,card_scheme,merchant_reference_number_h9 FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.statement_date = ${table_source}.statement_date);`;
            return pool.query(q);
        }
        
    }

    //Get payment
    static get_payment_processor(table_name, payment_column, term){
        const q = `SELECT * FROM ${table_name} WHERE ${ payment_column } = "${ term }";`;
        return pool.query(q);
    }

    //Get sum
    static get_sum(table_name,column,column_title_condition, item_condition, column_curr, item_curr){
        const q = `SELECT SUM(${column}) AS total_sum FROM ${table_name} WHERE ${column_title_condition} = "${item_condition}" AND ${column_curr} = "${item_curr}";`
        return pool.query(q);
    }

    static get_sum_recon(table_name,column, column_curr, item_curr){
        const q = `SELECT SUM(${column}) AS total_sum FROM ${table_name} WHERE ${column_curr} = "${item_curr}";`
        return pool.query(q);
    }

    
    static get_sum_fees(table_name, column, column_curr,curr){
        const q = `SELECT SUM(${column}) AS total_sum FROM ${table_name} WHERE ${column_curr} = "${curr}";`;
        return pool.query(q);
    }

    static get_record_statement(table_name, column_date, date ,column_curr, curr){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${column_date}="${date}" AND ${column_curr} = "${curr}"`;
        return pool.query(q);
    }


    /************************ remove data from table **************************/

    //Delete all data (clear) in table
    static deleteAllData(table_name){
        const q = `DELETE FROM ${table_name};`;
        return pool.query(q);
    }

    // delete with Id or any other condetion.
    static deleteDataById(id, table_name){
        const q = "DELETE FROM table_name WHERE condition;";
        return pool.query(q);
    }


    /************************ Search *********************************/
    //Searching
    static searching(table_name, column, item, column_id, item_id){
        const q =`SELECT * FROM ${table_name} WHERE ${column} = ${item} OR ${column_id} = ${item_id};`;
        return pool.query(q);
    }


    
}