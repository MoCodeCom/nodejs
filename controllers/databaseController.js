const db = require("../modules/Db");
/*----------------------- Credorex table --------------*/
exports.createTbl_credorex = (req,res,next)=>{
    db.createTable_credorex()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });

}

exports.deleteTbl_credorex = (req, res, next)=>{
    db.deleteTable('credorex')
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
}

/*----------- credorex index ----------------*/
exports.createTbl_credorex_index = (req,res,next)=>{
    db.createTable_credorex_index()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });

}


//--------------------- Cp table ------------------------//
exports.createTbl_cp = (req, res, next)=>{
    db.createTable_cp()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The cp_credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });
    
}

exports.deleteTbl_cp = (req, res, next)=>{
    
    db.deleteTable('cp_credorex')
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The cp_credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
    
}

//-------------------- Recon Credorex table -----------------//
exports.createTbl_recon_credorex = async(req, res, next)=>{
    await db.createTable_recon_credorex()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The Recon_credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });
}


exports.deleteTbl_recon_credorex = async(req, res, next)=>{
    
    await db.deleteTable('recon_credorex')
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The recon_credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
    
}

exports.deleteTbl_credorex_index = async(req, res, next)=>{
    
    await db.deleteTable('credorex_index')
    .then(result =>{
        res.status(200).json(
            {message:'The recon_credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
    
}

exports.reconciliation_credorex = async(req, res, next)=>{
    await db.delete_row_recon_same().then()

    
    await db.reconciliation_credorex()
    .then(result =>{
        res.status(200).json(
            {message:'reconciliation is done successfully!'}
        )
    })
    .catch(error =>{
        console.log(error);
    });
}

exports.get_reconcilitaion_credorex = async(req, res, next)=>{
    
    await db.get_reconciliation_credorex()
    .then(result =>{
        res.status(200).json(

            {
                message:'get data is done!.',
                data:result
            }
        );
        
    })
    /*
    .then(async()=>{
        
    })*/
    .catch(error =>{
        res.status(200).json({message:error})
    })
}

//db.delete_row_recon_same('recon_credorex');

exports.deleteAllData_recon_credorex = async(req, res, next)=>{
    await db.deleteAllData('recon_credorex')
    .then(result =>{
        res.status(200).json(

            {
                message:'delete all data form table is done!.',
            }
        );
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}

exports.deleteAllData_credorex = async(req, res, next)=>{
    await db.deleteAllData('credorex')
    .then(result =>{
        res.status(200).json({message:'delete all data form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}

exports.deleteAllData_cp_credorex = async(req, res, next)=>{
    await db.deleteAllData('cp_credorex')
    .then(result =>{
        res.status(200).json({message:'delete all data form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}

exports.deleteAllData_credorex_index = async(req, res, next)=>{
    await db.deleteAllData('credorex_index')
    .then(result =>{
        res.status(200).json({message:'delete all data form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    });
}

exports.deleteRow_recon_credorex = async(req, res, next)=>{
    const id = req.params.id;
    const condition = `ID_system = "${id}" OR ID_credorex = "${id}"`;

    await db.delete_row_reconciliation_credorex('recon_credorex',condition)
    .then(result =>{
        res.status(200).json({message:'delete data row form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    });
}

exports.deleteRow_recon_credorex_auto = async(req, res, next)=>{
    //const id = req.params.id;
    const condition = `ID_system = ID_credorex OR ID_credorex = ID_system`;

    await db.delete_row_reconciliation_credorex('recon_credorex',condition)
    .then(result =>{
        res.status(200).json({message:'delete data row form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    });
}



//************************************************************ */

