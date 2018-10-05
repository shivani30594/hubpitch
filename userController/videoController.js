const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');
const sys = require('sys');
const child_process = require('child_process');
const path = 'c:/wamp64/www/hubpitch/public/uploads/test'
const nrc = require('node-run-cmd');

class videoController {

    static async test(req, res) {
        const callbackTest = () => {
            res.send({ success: true })
        }
        nrc.run('ffmpeg -i foo/left.mp4 -i foo/right.mp4 -filter_complex hstack foo/output.mp4', { onDone: callbackTest });
    }

    static async test2(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                file_name: Joi.string()
                    .min(8)
                    .required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            const thisFile = req.body.file_name;
            let fileExtension = '';
            let filename = ''
            fileExtension = thisFile.split(".");
            filename = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
            var callback = function (exitCodes) {
                //console.log(exitCodes)
                console.log('filename == ', filename);
                console.log('fileExtension == ', fileExtension);
                res.send({ success: true });
            };
            //nrc.run('cd c:/wamp64/www/hubpitch/public/uploads/test', { onDone: callback });
            nrc.run('ffmpeg -i public/uploads/test/' + thisFile + ' -ss 00:00:10.0 -codec copy -t 10 foo/' + filename + '', { onDone: callback });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async cutVideoWithTime(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                file_name: Joi.string()
                    .min(8)
                    .required(),
                start_time: Joi.string().required(),
                end_time: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            const thisFile = req.body.file_name;
            let fileExtension = '';
            let filename = ''
            fileExtension = thisFile.split(".");
            filename = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
            var callback = function (exitCodes) {
                //console.log(exitCodes)
                console.log('filename == ', filename);
                console.log('fileExtension == ', fileExtension);
                res.send({ success: true });
            };
            //nrc.run('cd c:/wamp64/www/hubpitch/public/uploads/test', { onDone: callback });
            // nrc.run('ffmpeg -i public/uploads/test/' + thisFile + ' -ss 00:00:10.0 -codec copy -t 10 foo/' + filename + '', { onDone: callback });
            nrc.run('ffmpeg -i public/uploads/test/' + thisFile + ' -ss' + req.body.start_time + 'to' + req.body.end_time + ' -codec copy -t 10 foo/' + filename + '', { onDone: callback });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async margeVideo(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                file_names: Joi.any().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let filename = req.body.file_names;
            let conString = [];
            let counterA = 0
            let collactionOfName = []
            let fileTSName = '';
            //filename = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
            _.forEach(filename, function (val) {
                fileTSName = '';
                fileTSName = "temp_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
                conString[counterA] = 'ffmpeg -i foo/' + val + ' -c copy -bsf:v h264_mp4toannexb -f mpegts foo/' + fileTSName + '.ts'
                collactionOfName[counterA] = fileTSName + '.ts';
                counterA = counterA + 1;
            })
            let concatStringT = '';
            _.forEach(collactionOfName, (val) => {
                if (concatStringT == '') {
                    concatStringT = 'foo/' + val
                } else {
                    concatStringT = concatStringT + '|foo/' + val
                }
            })
            //  ffmpeg - i "concat:foo/temp1.ts|foo/temp2.ts" - c copy - bsf: a aac_adtstoasc foo / output223.mp4
            concatStringT = '"concat:' + concatStringT + '"'
            let outfileName = "pitch_edit_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
            console.log(outfileName);
            conString[counterA] = 'ffmpeg -i ' + concatStringT + ' -c copy -bsf:a aac_adtstoasc foo/' + outfileName + '.mp4';
            if (conString != '') {
                // let testing = ['ffmpeg -i foo/output133.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts foo/temp1.ts', 'ffmpeg -i foo/pitch_edit153848076455853138.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts foo/temp2.ts', 'ffmpeg -i "concat:foo/temp1.ts|foo/temp2.ts" -c copy -bsf:a aac_adtstoasc foo/output223.mp4']
                // console.log(testing[0]);
                // var successCallBack = function (exitCodes) {
                //     res.send({ success: true });
                // };
                // console.log(conString);
                // 'ffmpeg -i foo/output133.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts temp1.ts'
                // 'ffmpeg -i foo/pitch_edit153848076455853138.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts temp2.ts'
                // 'ffmpeg -i "concat:foo/temp1.ts|foo/temp2.ts" -c copy -bsf:a aac_adtstoasc foo/output2.mp4'
                // let cmdFFMPEG = 'ffmpeg -i "concat:' + conString + '"';
                // nrc.run(['ffmpeg -i foo/output133.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts foo/temp1.ts', 'ffmpeg -i foo/pitch_edit153848076455853138.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts foo/temp2.ts', 'ffmpeg -i "concat:foo/temp1.ts|foo/temp2.ts" -c copy -bsf:a aac_adtstoasc foo/output223.mp4'], { onData: successCallBack });
                // nrc.run('ffmpeg -i foo/output133.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts foo/temp1.ts');
                // nrc.run('ffmpeg -i foo/pitch_edit153848076455853138.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts foo/temp2.ts');
                console.log(conString);
                nrc.run(conString).then(function (exitCodes) {
                    res.send({ success: true });
                }, function (err) {
                    console.log('Command failed to run with error: ', err);
                    res.send({ success: false, error });
                });
                // console.log(conString);
                // res.send({ success: true, conString: conString });
            } else {
                res.send({ success: false, message: "Something Went Wrong" });
            }
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}

module.exports = videoController;