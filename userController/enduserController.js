const db = require("../dbconfig/db");
const Joi = require("joi");
var async = require('async');
const dir = '/uploads/test';

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
                db.query("SELECT master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id WHERE master_tbl.pitch_id = ?", results[0].pitch_id, function (
                    error,
                    results,
                    fields
                ) {
                    if (error) {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                    if (results.length > 0) {
                        res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id });
                    } else {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                })
            } else {
                res.send({ success: "false", message: "Something went wrong" });
            }
        })

    }

    static async pitchAnalytics(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_token: Joi.string()
                    .required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let newView = {};
            let updateView = {};
            let pitch_id = '';
            let viewCounter = 1;
            db.query("SELECT pitch_id from hp_pitch_manager where url_token=? ", req.body.pitch_token, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    res.send({ success: "false", message: "Something went wrong || Pitch Token" });
                }
                if (results.length > 0) {
                    pitch_id = results[0].pitch_id
                    db.query("SELECT * from hp_pitch_analytics where pitch_id=? ", pitch_id, function (
                        error,
                        results,
                        fields
                    ) {
                        if (error) {
                            res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                        }
                        if (results) {
                            if (results.length === 0) {
                                newView = {
                                    'pitch_id': pitch_id,
                                    'pitch_view_counter': viewCounter,
                                    'pitch_page_analytics': ''
                                }
                                db.query("INSERT INTO hp_pitch_analytics SET?", newView, function (
                                    error,
                                    results,
                                    fields
                                ) {
                                    if (error) {
                                        res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                                    }
                                    res.send({ success: "true", message: "View Added" });

                                });
                            } else {
                                viewCounter = viewCounter + results[0].pitch_view_counter
                                db.query("UPDATE hp_pitch_analytics SET pitch_view_counter ='" + viewCounter + "' WHERE `pitch_analytics` = '" + results[0].pitch_analytics + "'", function (error,
                                    results,
                                    fields) {
                                    if (error) {
                                        res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                                    }
                                    res.send({ success: "true", message: "View Update" });
                                })
                            }
                        }
                        else {
                            res.send({ success: "false", message: "Something went wrong with SQL Analytics" });
                        }
                    });
                } else {
                    res.send({ success: "false", message: "Something went wrong with SQL" });
                }
            })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async pitchPageView(req, res) {

    }
}
module.exports = enduserController;