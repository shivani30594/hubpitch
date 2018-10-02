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
        var task1 = child_process.exec('cd ' + path, function (error, stdout, stderr) {
            console.log('stdout: ------>' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        var task2 = child_process.exec('ls -t', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
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
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}

module.exports = videoController;