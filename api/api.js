import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        req.picName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, req.picName);
    }
});
var upload = multer({ storage: storage })
import FollowController from '../db/controller/FollowController.js'
import PageCategoryController from '../db/controller/PageCategoryController.js'
import ContentController from '../db/controller/ContentController.js'
import UserController from '../db/controller/UserController.js'
const api = express.Router()

// Verify token
const verifyToken = (req, res, next) => {
        let tk = req.headers["authorization"];
        const tkArray = tk.split(" ");
        req.token = tkArray[1];
        if (req.token == undefined) {
            res.send({ status: 0, message: "Token missing." })
        } else {
            jwt.verify(req.token, 'secret', function(err, decoded) {
                if (err) {
                    res.send({ status: 0, message: "Invalid token." })
                } else {
                    next()
                }
            });
        }
    }
    // Follow URL's
api.post('/follow', FollowController.postFollows)
api.get('/follow', FollowController.getFollows)
api.put('/follow/update/:id', FollowController.updateFollow)
api.delete('/follow/delete/:id', FollowController.deleteFollow)

// PAGE Categories URL's
api.post('/page/category', PageCategoryController.postPageCategory)
api.get('/page/category', PageCategoryController.getPageCategory)

// Content URL's
api.post('/content', ContentController.postContent)
api.get('/content', ContentController.getContent)
api.put('/content/update/:id', ContentController.updateContent)
api.delete('/content/delete/:id', ContentController.deleteContent)
api.get('/page/:id', ContentController.getPageContentByPageId)

// User URL's

api.post('/user/login', UserController.login)
api.post('/user/register', upload.single('pic'), UserController.register)

api.get('/user/edit/:id', verifyToken, UserController.editById)
api.put('/user/update/:id', verifyToken, UserController.updateById)
api.post('/user/forget-password', UserController.sendNewPwd)
api.put('/user/activate/:id', UserController.activeUser)
api.delete('/user/delete/:id', verifyToken, UserController.deleteById)
api.get('/user/list/:email', verifyToken, UserController.getAll)

export default api