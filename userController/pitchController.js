const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const dir = './uploads/test';
const fs = require('fs')
class pitchController {

    static async addNewPitchView(req, res, next) {
        res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch' });
    }

    static async addPitch(req, res, next) {
        console.log('assd===? files == ',req.files);
        console.log('assd===? body == ',req.body);
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                company_name: Joi.string()
                    .min(3)
                    .required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.headers['access-token'];
            let userid = '';
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });


            // if (!req.files) {
            //     res.send('No files were uploaded.');
            //     return;
            // }
            // for (var key in req.files) {
            //     thisFile = req.files[key];
            //     console.log(req.files[key].name);
            //     thisFile.mv(dir + '/' + req.files[key].name, function (err) {
            //         if (err) {
            //             console.log(err);
            //         }
            //         else {
            //             console.log('File uploaded!');
            //         }
            //     });
            // }

            // for (var key in req.files) { 
            //     var thisFile = req.files[key];
            //     console.log(thisFile);
            //     if (mimetype.indexOf(file.mimetype) !== -1) {
            //             if (!fs.existsSync(dir)) {
            //                 fs.mkdirSync(dir);
            //             }
            //             var fileExtension = '';
            //             var filename = '';
            //             fileExtension = thisFile.mimetype.split("/");
            //             filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
            //             file.mv(dir + '/' + filename, async (err) => {
            //                 if (err) {
            //                     console.log("There was an issue in uploading cover image");
            //                 } else {
            //                     console.log("File has been uploaded");
            //                 }
            //             });

            //         } else {
            //             return res.status(500).send({ success: false, message: 'File is not support by HubPitch System' , file:thisFile });
            //         }
            // }
            // _.forEach(req.files, function (key, value) {
               
            //     //fileExtension = file.mimetype.split("/");
                
            // })

            // var file = req.files['pitch_files'];
            // var mimetype = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
            // if (mimetype.indexOf(file.mimetype) !== -1) {
            //     if (!fs.existsSync(dir)) {
            //         fs.mkdirSync(dir);
            //     }

            //     var filename = "cover_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
            //     file.mv(dir + '/' + filename, async (err) => {
            //         if (err) {
            //             console.log("There was an issue in uploading cover image");
            //         } else {
            //             console.log("File has been uploaded");

            //         }
            //     });
            // } else {
            //     return res.status(500).send({ success: false, message: 'File is not support by HubPitch System' });
            // }

            // let pitchID = '';
            // let newPitch = {
            //     company_name: req.body.company_name,
            //     user_id: userid,
            // }
            // db.query("INSERT INTO hp_pitch_master SET?", newPitch, function (
            //     error,
            //     results,
            //     fields
            // ) {
            //     if (results.insertId) {
            //         pitchID = results.insertId;
            //         _.forEach(req.body.pitch_attachment, function (key, value) {
            //             let newPitchInfo = {}
            //             newPitchInfo = {
            //                 'pitch_id': pitchID,
            //                 'pitch_attachment_type': key.pitch_attachment_type,
            //                 'pitch_attachment_name': key.pitch_attachment_name,
            //                 'pitch_attachment_text': key.pitch_attachment_text
            //             }
            //             db.query("INSERT INTO hp_pitch_info SET?", newPitchInfo, function (error,
            //                 results,
            //                 fields) {
            //                 if (results.affectedRows) {
            //                     res.send({ success: "true", message: "New Pitch Added" });
            //                 } else {
            //                     console.log(error,
            //                         results,
            //                         fields)
            //                     res.send({ success: "false", message: "Something went wrong || Info Table" });
            //                 }
            //             })
            //         })
            //     }
            //     else {
            //         console.log(error,
            //             results,
            //             fields)
            //         res.send({ success: "false", message: "Something went wrong || Master Table" });
            //     }
            // });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async deletePitch(req, res, next) {
        if (req.body.pitch_delete_type = 'full') {
            try {
                const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                    pitch_id: Joi.string()
                        .required()
                });
                if (pitchData.error) {
                    res.send({ success: false, error: pitchData.error });
                    return;
                }
                db.query("DELETE FROM hp_pitch_master WHERE pitch_id=?", req.body.pitch_id, function (error, results, fields) {
                    if (results.affectedRows) {
                        res.send({ success: "true", message: "Delete Pitch!" });
                    } else {
                        console.log(error, results, fields)
                        res.send({ success: "false", message: "Something went wrong || Master Table" });
                    }
                })
            }
            catch (error) {
                console.error(error);
                res.send({ success: false, error });
            }
        } else {
            try {
                const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                    att_pitch_id: Joi.string()
                        .required()
                });
                if (pitchData.error) {
                    res.send({ success: false, error: pitchData.error });
                    return;
                }
                db.query("DELETE FROM hp_pitch_info WHERE pitch_info_id=?", req.body.att_pitch_id, function (error, results, fields) {
                    if (results.affectedRows) {
                        res.send({ success: "true", message: "Delete Pitch!" });
                    } else {
                        console.log(error, results, fields)
                        res.send({ success: "false", message: "Something went wrong || Info Table" });
                    }
                })
            }
            catch (error) {
                console.error(error);
                res.send({ success: false, error });
            }
        }
    }

    static async getPitch(req, res, next) {
        var token = req.headers['access-token'];
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

            } else {
                userid = decoded.user;
            }
        });
        db.query("SELECT DISTINCT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.user_id=? GROUP BY hp_pitch_info.pitch_id", userid, function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async viewPitchDetails(req, res, next) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_id: Joi.string()
                    .required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT DISTINCT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.pitch_id=? GROUP BY hp_pitch_info.pitch_id", userid, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    res.send({ success: "true", data: results });
                } else {
                    console.log(error, results, fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = pitchController;