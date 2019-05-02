const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');
//const sys = require('sys');
const child_process = require('child_process');
const path = 'c:/wamp64/www/hubpitch/public/uploads/test'
const nrc = require('node-run-cmd');
'use strict';
let videoStitch = require('video-stitch');
let videoMerge = videoStitch.merge;

//var ffmpeg = require("../public/lib/fluent-ffmpeg");
var ffmpeg = require('fluent-ffmpeg-extended');
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
            console.log(fileExtension[1]);
            if (fileExtension[1] == 'mp4') {
                filename = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
                var callback = function (exitCodes) {
                    console.log('filename == ', filename);
                    console.log('fileExtension == ', fileExtension);
                    res.send({ success: true });
                };
                let stringCMDFFMPEG = 'ffmpeg -i foo/' + thisFile + ' -ss ' + req.body.start_time + ' -to ' + req.body.end_time + ' -codec copy foo/' + filename;
                console.log('stringCMDFFMPEG', stringCMDFFMPEG);
                nrc.run(stringCMDFFMPEG, { onDone: callback });
            }
            else if (fileExtension[1] == 'avi') {
                console.log('AVI Ma aaviyo')
                let rawName = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
                filename = rawName + '.' + fileExtension[1];
                var callback = function (exitCodes) {
                    let aviToMp4 = 'ffmpeg -i foo/' + filename + ' -strict -2 foo/' + rawName + '.mp4'
                    var callbackFinal = (exitCodes) => {
                        console.log('Thai am keh')
                        console.log('aviToMp4 CMD----------------->', aviToMp4)
                        res.send({ success: true });
                    }
                    nrc.run(aviToMp4, { onDone: callbackFinal })
                };
                let stringCMDFFMPEG = 'ffmpeg -i foo/' + thisFile + ' -ss ' + req.body.start_time + ' -to ' + req.body.end_time + ' -codec copy foo/' + filename;
                console.log('stringCMDFFMPEG', stringCMDFFMPEG);
                nrc.run(stringCMDFFMPEG, { onDone: callback });


            } else if (fileExtension[1] == 'mpeg') {
                console.log('mpeg Ma aaviyo')
                let rawName = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
                filename = rawName + '.' + fileExtension[1];
                var callback = function (exitCodes) {
                    let mpegToMp4 = 'ffmpeg -i foo/' + filename + ' foo/' + rawName + '.mp4'
                    var callbackFinal = (exitCodes) => {
                        console.log('Thai am keh')
                        console.log('mpegToMp4 CMD----------------->', mpegToMp4)
                        res.send({ success: true });
                    }
                    nrc.run(mpegToMp4, { onDone: callbackFinal })
                };

                let stringCMDFFMPEG = 'ffmpeg -i foo/' + thisFile + ' -ss ' + req.body.start_time + ' -to ' + req.body.end_time + ' -codec copy foo/' + filename;
                console.log('stringCMDFFMPEG', stringCMDFFMPEG);
                nrc.run(stringCMDFFMPEG, { onDone: callback });
            } else if (fileExtension[1] == 'mpg') {
                console.log('mpg Ma aaviyo')
                let rawName = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
                filename = rawName + '.' + fileExtension[1];
                var callback = function (exitCodes) {
                    let mpgToMp4 = 'ffmpeg -i foo/' + filename + ' foo/' + rawName + '.mp4'
                    var callbackFinal = (exitCodes) => {
                        console.log('Thai am keh')
                        console.log('mpgToMp4 CMD----------------->', mpgToMp4)
                        res.send({ success: true });
                    }
                    nrc.run(mpgToMp4, { onDone: callbackFinal })
                };
                let stringCMDFFMPEG = 'ffmpeg -i foo/' + thisFile + ' -ss ' + req.body.start_time + ' -to ' + req.body.end_time + ' -codec copy foo/' + filename;
                console.log('stringCMDFFMPEG', stringCMDFFMPEG);
                nrc.run(stringCMDFFMPEG, { onDone: callback });
            }
            else if (fileExtension[1] == 'mov') {
                console.log('mov Ma aaviyo')
                let rawName = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
                filename = rawName + '.' + fileExtension[1];
                var callback = function (exitCodes) {
                    let movToMp4 = 'ffmpeg -i foo/' + filename + ' -vcodec h264 -acodec mp2 foo/' + rawName + '.mp4'
                    var callbackFinal = (exitCodes) => {
                        console.log('Thai am keh')
                        console.log('movToMp4 CMD----------------->', movToMp4)
                        res.send({ success: true });
                    }
                    nrc.run(movToMp4, { onDone: callbackFinal })
                };
                let stringCMDFFMPEG = 'ffmpeg -i foo/' + thisFile + ' -ss ' + req.body.start_time + ' -to ' + req.body.end_time + ' -codec copy foo/' + filename;
                console.log('stringCMDFFMPEG', stringCMDFFMPEG);
                nrc.run(stringCMDFFMPEG, { onDone: callback });

            } else {
                res.send({ success: false, message: 'Something Went Wrong!' });
            }
            // else if (fileExtension[1] == 'mkv') {
            //     console.log('mkv Ma aaviyo')
            //     let rawName = "pitch_edit" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000)
            //     filename = rawName + '.' + fileExtension[1];
            //     var callback = function (exitCodes) {
            //         let mkvToMp4 = 'ffmpeg -i foo/' + filename + ' -codec copy foo/' + rawName + '.mp4'
            //         var callbackFinal = (exitCodes) => {
            //             console.log('Thai am keh')
            //             console.log('mkvToMp4 CMD----------------->', mkvToMp4)
            //             res.send({ success: true });
            //         }
            //         nrc.run(mkvToMp4, { onDone: callbackFinal })
            //     };
            //     let stringCMDFFMPEG = 'ffmpeg -i foo/' + thisFile + ' -ss ' + req.body.start_time + ' -to ' + req.body.end_time + ' -codec copy foo/' + filename;
            //     console.log('stringCMDFFMPEG', stringCMDFFMPEG);
            //     nrc.run(stringCMDFFMPEG, { onDone: callback });
            // }
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

                //console.log(conString);
                nrc.run(conString).then(function (exitCodes) {
                    //console.log('-----------------', conString);
                    //console.log('================================---------------', collactionOfName);
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

    static async testVideoStitch(req, res) {
        videoMerge()
            .original({
                "fileName": "foo/mikethefrog.mp4",
                "duration": "hh:mm:ss"
            })
            .clips([
                {
                    "startTime": "00:00:00",
                    "fileName": "foo/mikethefrog.mp4",
                    "duration": "00:00:04"
                },
                {
                    "startTime": "00:00:04",
                    "fileName": "foo/mikethefrog.mp4",
                    "duration": "00:00:10"
                },
                {
                    "startTime": "00:00:10",
                    "fileName": "foo/mikethefrog.mp4",
                    "duration": "00:00:24"
                }
            ])
            .merge()
            .then((outputFile) => {
                console.log('path to output file', outputFile);
            });
    }

    // static async testfluentFFMPEG(req, res) {
    //     var firstFile = "foo/pitch_edit_153908610726150335.mp4";
    //     var secondFile = "foo/mikethefrog.mp4";
    //     var outPath = "foo/fluentFFMPEG_out.mp4";

    //     var proc = ffmpeg(firstFile)
    //         .input(secondFile)
    //         //.input(thirdFile)
    //         //.input(fourthFile)
    //         //.input(...)
    //         .on('end', function () {
    //             console.log('files have been merged succesfully');
    //         })
    //         .on('error', function (err) {
    //             console.log('an error happened: ' + err.message);
    //         })
    //         .mergeToFile(outPath);
    // }

    static async testfluentFFMPEG2(req, res) {
        var firstFile = "foo/pitch_edit_153908610726150335.mp4";
        var secondFile = "foo/mikethefrog.mp4";
        var outPath = "foo/fluentFFMPEG_out.mp4";

        var proc = new ffmpeg({ source: "foo/pitch_edit153915380637454170.mp4" })
            .mergeAdd("foo/pitch_edit153915381641420320.mp4")
            .mergeToFile("foo/test_output_.mp4", function () {
                console.log('files has been merged succesfully');
                res.send({ success: true });
            });
    }
}

module.exports = videoController;