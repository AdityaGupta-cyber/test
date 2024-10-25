const express = require('express');
const {
    login,
    signUp,
    logout,
    renderLogin,
    renderSignup,
    list,
    singleList,
    renderUploadPic,
    upload,
    uploaded,
    renderEditPic,
    updatePic,
    deletePic,
    renderDeletePic
} = require('../controller/authController');
const authenticateJwt = require('../middleware/authMiddleware');
const checkOwnership = require('../middleware/ownershipMiddleware');

const router = express.Router();

router.get('/', renderLogin);
router.get('/signup', renderSignup);
router.get('/list', authenticateJwt, list);
router.get('/list/:id', authenticateJwt, singleList);
router.post('/login', login);
router.post('/signUp', signUp);
router.post('/logout', logout);
router.get('/uploadPic',authenticateJwt,renderUploadPic)
router.post('/upload',authenticateJwt, uploaded.single('image'),upload)
router.get('/edit/:id',authenticateJwt,checkOwnership,renderEditPic)
router.post('/update/:id',authenticateJwt,uploaded.single('image'),updatePic)
router.get('/delete/:id',authenticateJwt,renderDeletePic)
router.post('/delete/:id',authenticateJwt,checkOwnership,deletePic)

module.exports = router;
