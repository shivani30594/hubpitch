var express = require('express');
var router = express.Router();
const Controller = require('../userController');
const adminController = require('../adminController');
function wrap(func) {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    };
}
/* GENRAL PAGE CALLING METHOD */
router.get('/', function (req, res, next) {
    res.render('loginModule/index', { title: 'SignIn || Hub Pitch' });
});
router.get('/signup', function (req, res, next) {
    res.render('loginModule/signup', { title: 'SignUp || Hub Pitch' });
});
router.get('/payment', function (req, res, next) {
    res.render('loginModule/', { title: 'Payment Page || Hub Pitch' });
});
router.get('/forgot-password', function (req, res, next) {
    res.render('loginModule/forget', { title: 'Forgot Password || Hub Pitch' });
});
router.get('/reset-password/:id', Controller.authController.checkToken);

/** 
 * 
 *  ====== USER PAGE CALLING METHOD 
 *  
 */
router.get('/user/dashboard', Controller.dashboardController.dashboard);
router.get('/user/profile', Controller.usersController.profile);

// Pitch Module 
router.get('/pitch/add', Controller.pitchController.addNewPitchView);
router.get('/user/pitch/viewer/:id', Controller.pitchController.viewPitchDetails)
router.get('/user/pitch/edit/:id', Controller.pitchController.editPitchPage)

/**
 * 
 * =========== ADMIN PAGE CALLING METHOD
 * 
 */

router.get('/admin/dashboard', adminController.dashboardController.dashboard);
router.get('/admin/profile', adminController.dashboardController.profile);
router.get('/admin/manage-pitch', adminController.pitchController.allUsersPitchView)


/**
 * 
 * ==================== END USER ROUTES & METHODS
 * 
 */

router.get('/viewer/:id', Controller.enduserController.viewPitch)

// Pitch Analytics
router.post('/pitch-analytics', Controller.enduserController.pitchAnalytics)
router.post('/pitch-page-view', Controller.enduserController.pitchPageView)
router.post('/share-pitch', Controller.enduserController.sharePitch);
router.post('/conversation-creater', Controller.enduserController.conversationCreater);
router.post('/send-message', Controller.enduserController.sendMessage);
router.post('/get_conversation_', Controller.enduserController.getConversation)
router.post('/mark_as_read_conversation_end_user', Controller.enduserController.markAsReadConversation)
router.post('/check_for_update', Controller.enduserController.checkforUpdate)
router.post('/note-creater', Controller.enduserController.noteCreater)

/** 
 * 
 * ================ API METHODS ========
 * 
 */

// GENRAL API METHOD

router.post('/signup', Controller.authController.singup);
router.post('/signin', Controller.authController.signin);
router.post('/forgot_password', Controller.authController.forgotPassword);
router.post('/reset_password', Controller.authController.resetPassword);
router.post('/me', Controller.usersController.me)

// ADMIN API METHOD


// PITCH METHOD

router.post('/admin/get_pitch', adminController.pitchController.getPitch);
router.post('/admin/get_user_pitch', adminController.pitchController.viewPitchDetails);

// SUPPORT METHOD

router.post('/admin/get_support_message', adminController.dashboardController.profile);
router.post('/admin/get_single_support_message', adminController.dashboardController.profile);

// USER API METHOD

// PITCH
router.post('/add_pitch', Controller.pitchController.addPitch);
router.post('/get_user_pitchs', Controller.pitchController.getPitch)
router.post('/detele_pitch', Controller.pitchController.deletePitch)
router.post('/manage_pitch', Controller.pitchController.managePitch)
router.post('/sharing_details', Controller.pitchController.sharingDetails)
router.post('/edit_pitch', Controller.pitchController.editPitch)
router.post('/get_conversation', Controller.pitchController.getConversation)
router.post('/get_conversation_messages', Controller.pitchController.getPitchMessage)
router.post('/mark_as_read_conversation', Controller.pitchController.markAsReadConversation)
router.post('/reply_message', Controller.pitchController.replyPitchMessage)
router.post('/add_new_file', Controller.pitchController.addNewPitchInExiting)
router.post('/share_pitch_email', Controller.pitchController.sharePitchWithEmail)
router.post('/update_share_pitch_email', Controller.pitchController.updateSharePitchWithEmail)
router.post('/edit_pitch_text', Controller.pitchController.editText)

// SUPPORT 

router.post('/send_support_message', Controller.supportController.send_support);
module.exports = router;