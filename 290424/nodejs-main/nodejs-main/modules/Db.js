const pool = require('../util/database');
/*-------------------------------------------------*/

/*-------------------------------------------------*/
module.exports = class Data{
    constructor(){}
    save(){}
    /***************** Check exist table **************/
    static exist_Table(table_name) {
        const q = `SELECT EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'appdb' AND table_name = '${table_name}') AS tableExists`;
        return pool.query(q);
    }

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
        const q = "CREATE TABLE cp_credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(20),Status VARCHAR(10),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }


    /***************** Credorx ************************/

    static createTable_credorex(){
        const q = "CREATE TABLE credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(20),posting_date VARCHAR(20) ,transaction_currency VARCHAR(10) ,transaction_amount VARCHAR(45) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(15),card_scheme_fees VARCHAR(15),acquiring_fee VARCHAR(15),net_activity VARCHAR(15),card_scheme VARCHAR(15), merchant_reference_number_h9 VARCHAR(20),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    static createTable_credorex_index(){
        const q = "CREATE TABLE credorex_index (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(20),posting_date VARCHAR(20) ,transaction_currency VARCHAR(10) ,transaction_amount VARCHAR(45) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(15),card_scheme_fees VARCHAR(15),acquiring_fee VARCHAR(15),net_activity VARCHAR(15),card_scheme VARCHAR(15), merchant_reference_number_h9 VARCHAR(20),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    /************************ Reconcilitaion ************************/

    static createTable_recon_credorex(){
        const q = "CREATE TABLE recon_credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20),ID_system VARCHAR(20) ,ID_processor VARCHAR(20),amount_system VARCHAR(20) ,amount_processor VARCHAR(20),status VARCHAR(10),posting_date_system VARCHAR(50),posting_date_processor VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }


    static reconciliation_credorex(){

        const q1 = "INSERT INTO appdb.recon_credorex (statement_date,ID_system,amount_system, posting_date_system) SELECT statement_date,merchant_reference_number_h9, transaction_amount,posting_date FROM appdb.credorex LEFT JOIN appdb.cp_credorex ON appdb.cp_credorex.ID_trans = appdb.credorex.merchant_reference_number_h9 WHERE appdb.cp_credorex.ID_trans IS NULL; ";
        const q2 = "INSERT INTO appdb.recon_credorex (statement_date,ID_processor,amount_processor, posting_date_processor) SELECT sDate,ID_trans,Paid,rDate FROM appdb.cp_credorex LEFT JOIN appdb.credorex ON appdb.credorex.merchant_reference_number_h9 = appdb.cp_credorex.ID_trans WHERE appdb.credorex.merchant_reference_number_h9 IS NULL;";
        return pool.query(q1).then(()=>{
            pool.query(q2);
        });
        //return pool.query(q2);
    }

    static reconciliation_check(table_name, condetion){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${condetion};`;
        return pool.query(q);
    }

    static get_reconciliation_credorex(){
        const q = "SELECT * FROM appdb.recon_credorex;";
        return pool.query(q);
    }

    static delete_row_reconciliation_credorex(table_name, condetion){
        const q = `DELETE FROM ${table_name} WHERE ${condetion}`;
        return pool.query(q); 
    };

    static delete_row_recon_same(table_name, column_name){
        //const q = `DELETE FROM ${table_name} WHERE id NOT IN (SELECT id FROM (SELECT MIN(id) AS id FROM ${table_name} GROUP BY ${column_name}) AS t)`;
        const q = `DELETE FROM appdb.${table_name} WHERE ID IN ( SELECT ID FROM(SELECT ID, ROW_NUMBER() OVER(PARTITION BY ${column_name} ORDER BY ID) AS row_num FROM appdb.${table_name} WHERE ${column_name} IS NOT NULL) AS t WHERE row_num > 1);`
        return pool.query(q);
    }

 

    /************************ remove data from table **************************/

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
    static searching(table_name, column, item, column_id, item_id){
        const q =`SELECT * FROM ${table_name} WHERE ${column} = ${item} OR ${column_id} = ${item_id};`;
        return pool.query(q);
    }


    
}