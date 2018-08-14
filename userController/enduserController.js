const db = require("../dbconfig/db");
const Joi = require("joi");
var async = require('async');
const dir = './uploads/test';

class enduserController {

    static async viewPitch(req, res) {
        db.query("SELECT pitch_id from hp_pitch_manager where url_token=? ", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (error) {
                res.send({ success: "false", message: "Something went wrong" });
            }
            if (results.length > 0) {
                db.query("SELECT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created,hp_pitch_info.pitch_attachment_type,hp_pitch_info.pitch_attachment_name,hp_pitch_info.pitch_attachment_text FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.pitch_id=? GROUP BY hp_pitch_info.pitch_id", results[0].pitch_id, function (
                    error,
                    results,
                    fields
                ) {
                    if (error) {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                    if (results.length > 0) {
                        console.log(
                            results)
                        res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', data: results });
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