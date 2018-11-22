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
    res.render('loginModule/signup', { title: 'hubPitch Sign Up' });
});
router.get('/payment', Controller.stripePaymentController.paymentPage);
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
router.get('/admin/manage-subscription', adminController.subscriptionController.manageSubscription)
router.get('/admin/stripe-managment', adminController.subscriptionController.manageStripeSetting)
router.get('/admin/add-plan', adminController.subscriptionController.addPlanPage)
router.get('/admin/edit-plan/:id', adminController.subscriptionController.editPlanPage)


/**
 * 
 * ==================== END USER ROUTES & METHODS
 * 
 */

router.get('/viewer/:pitch_id&:viewer_id', Controller.enduserController.viewPitch)
router.get('/welcome', function (req, res, next) {
    res.render("loginModule/welcome", { title: 'Free SignUp || Hub Pitch', documents_viewer: 'false', free: 'true' });
});

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
router.post('/get-notes', Controller.enduserController.getNotes)
router.post('/get-viewer', Controller.enduserController.getViewerFromToken)
router.post('/end-user-login',Controller.enduserController.viewerLogin)

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
router.post('/user/update_profile', Controller.usersController.updateProfile)
router.post('/user/change_password', Controller.authController.changePassword)

// ADMIN API METHOD


// PITCH METHOD

router.post('/admin/get_pitch', adminController.pitchController.getPitch);
router.post('/admin/get_user_pitch', adminController.pitchController.viewPitchDetails);
router.post('/admin/update_profile', adminController.dashboardController.updateProfile)

// SUPPORT METHOD

router.post('/admin/get_support_message', adminController.dashboardController.profile);
router.post('/admin/get_single_support_message', adminController.dashboardController.profile);

// USER API METHOD

// Subscription

router.post('/admin/add_stripe_setting', adminController.subscriptionController.addStripeSetting);
router.post('/admin/add_membership_plan', adminController.subscriptionController.addMembershipPlan);
router.post('/admin/view_membership_plan', adminController.subscriptionController.getPlanByID);
router.post('/admin/edit_membership_plan', adminController.subscriptionController.editPlan);
router.post('/admin/remove_membership_plan', adminController.subscriptionController.removePlan);

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
router.post('/share_pitch_user', Controller.pitchController.sharePitchU)
router.post('/edit_pitch_text', Controller.pitchController.editText)
router.post('/get_notes', Controller.pitchController.getNotes)
router.post('/user/search_pitch', Controller.pitchController.searchPitch)

// SUPPORT 

router.post('/send_support_message', Controller.supportController.send_support);

// VIDEO 

router.post('/video_test', Controller.videoController.test);
router.post('/video_test2', Controller.videoController.testfluentFFMPEG2);
router.post('/marge_video', Controller.videoController.margeVideo);
router.post('/cut_video', Controller.videoController.cutVideoWithTime);
router.post('/test_stripe', Controller.stripePaymentController.testStripe);
router.post('/payment_status/:id', Controller.stripePaymentController.payment);
router.post('/sign_up_free/:id', Controller.stripePaymentController.signUpFree);

module.exports = router;