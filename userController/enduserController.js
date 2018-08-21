const db = require("../dbconfig/db");
const Joi = require("joi");
var async = require('async');
const dir = './uploads/test';

class enduserController {

    static async viewPitch(req, res) {
        console.log(req.params.id);
        db.query("SELECT pitch_id from hp_pitch_manager where url_token=? ", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (error) {
                res.send({ success: "false", message: "Something went wrong" });
            }
            if (results.length > 0) {
                db.query("SELECT master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id WHERE master_tbl.pitch_id = ?", results[0].pitch_id, function (
                    error,
                    results,
                    fields
                ) {
                    if (error) {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                    if (results.length > 0) {
                        console.log('LENGTH +++++++++++++++ ',results.length);
                        console.log('DATA +++++++++++++++ ',results);
                        res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length });
                    } else {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                })
            } else {
                res.send({ success: "false", message: "Something went wrong" });
            }
        })

    }
}
module.exports = enduserController;