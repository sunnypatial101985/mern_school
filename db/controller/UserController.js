import jwt from 'jsonwebtoken'
import User from "../model/user.js";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
// ADD jwt

class UserController {
    saltRounds = 10;

    static register = async(req, res) => {
        const { email, name, password, gender, active } = req.body
        const users = await User.findOne({ email });
        if (users) {
            res.send({ status: 0, message: "Email already exist." })
        } else {
            let pic = req.picName;
            let genderStatus = 1;
            if (gender == "female") {
                genderStatus = 2;
            }
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const uObj = new User
            uObj.email = email
            uObj.password = hash
            uObj.name = name
            uObj.pic = pic
            uObj.gender = genderStatus
            uObj.active = active
            await uObj.save().then((docs) => {
                // Call email
                UserController.callEmail(docs.email + "|-|" + docs._id, "insert")
                    // res.send(docs)
                res.send({ status: 1, message: "Registered successfully. Sent email with activation link." })
            }).catch((error) => {
                // res.send(error)
                res.send({ status: 0, message: "Server error, try again." })
            })
        }
    }
    static makeid = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    static sendNewPwd = async(req, res) => {
        let email = req.body.email
        const users = await User.findOne({ email });
        if (users) {
            let pwd = UserController.makeid(5);
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hash = bcrypt.hashSync(pwd, salt);
            User.findOneAndUpdate({ email: email }, { $set: { password: hash } }, { new: true }).then((docs) => {
                // Call email + pwd
                UserController.callEmail(email + "|-|" + pwd, "forget")
                res.send({ status: 1, message: "Sent new password in the email." })
            }).catch((error) => {
                res.send({ status: 0, message: "Server error, try again." })
            })
        } else {
            res.send({ status: 0, message: "Email not exist." })
        }
    }
    static callEmail = async(id, status) => {
        await UserController.sendEmail(id, status)
    }
    static activeUser = (req, res) => {
        let id = req.params.id
        User.findOneAndUpdate({ _id: id }, { $set: { active: true } }, { new: true }).then((docs) => {
            res.send({ status: 1, message: "User activated successfully." })
        }).catch((error) => {
            res.send({ status: 0, message: "Id not exist." })
        })
    }

    static getAll = async(req, res) => {
        await User.find({ email: { $ne: req.params.email } }).sort("email").then((docs) => {
            res.send({ status: 1, message: "valid user.", data: docs })
        }).catch((error) => {
            res.send({ status: 0, message: "not valid user.", data: [] })
        })
    }
    static checkUserPassword = async(password, hashpwd) => {
        const match = await bcrypt.compare(password, hashpwd);
        if (match) {
            return true
        }
        return false;
    }
    static login = async(req, res) => {
        const { email, password } = req.body
            // const users = await User.findOne({ email });
            // if (users) {
            //     let hashpwd = users.password
            //     const match = await UserController.checkUserPassword(password, hashpwd);
            //     if (match) {
            //         res.send(users)
            //     } else {
            //         res.send({ msg: "wrong password" })
            //     }
            // } else {
            //     res.send({ msg: "wrong email address" })
            // }

        await User.findOne({ email }).then(async(docs) => {
            let hashpwd = docs.password
            const match = await UserController.checkUserPassword(password, hashpwd);
            if (match) {
                // CREATE TOKEN
                var token = jwt.sign({ email: docs.email, pwd: docs.password }, 'secret', { expiresIn: '1h' });
                res.send({ status: 1, message: "Login successfully.", token: token, name: docs.name })
            } else {
                res.send({ status: 0, message: "Wrong password." })
            }
        }).catch((error) => {
            // console.log(error)
            res.send({ status: 0, message: "Wrong email address." })
        })
    }
    static updateById = async(req, res) => {
        let id = req.params.id
        await User.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true }).then((docs) => {
            // res.send(docs)
            res.send({ status: 1, message: "Updated." })
        }).catch((error) => {
            // res.send(error)
            res.send({ status: 0, message: "Server error." })
        })
    }
    static deleteById = async(req, res) => {
        let id = req.params.id
        await User.deleteOne({ _id: id }).then((docs) => {
            res.send({ status: 1, message: "User deleted." })
        }).catch((error) => {
            res.send({ status: 0, message: "Server error." })
        })
    }
    static editById = async(req, res) => {
        let id = req.params.id
        await User.findOne({ _id: id }).then((docs) => {
            if (docs) {
                res.send({
                    status: 1,
                    message: "User deleted.",
                    detail: docs
                })

            } else {
                res.send({ status: 0, message: "wrong id" })
            }
        }).catch((error) => {
            res.send({ status: 0, message: "wrong id" })
        })
    }
    static sendEmail = async(id, st) => {
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "sunnypatial1985@gmail.com", // generated ethereal user
                pass: "nmtiesdyveutvdjt", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let lHtml = '';
        let eSubj = "";
        let dArr = id.split("|-|");
        let emailAddr = dArr[0];
        if (st == "insert") {
            eSubj = "Activate link";
            lHtml += '<b>Activate your account, click below link</b>';
            lHtml += '<br/><a href="' + process.env.FRONT_END_URL + 'user/activate/' + dArr[1] + '">Click here</a>';
        } else if (st == "forget") {
            eSubj = "New password";
            lHtml += '<b>Your updated password: ' + dArr[1] + '</b>';
            lHtml += '<br/><a href="' + process.env.FRONT_END_URL + '">Click here to open a website</a>';
        }
        let info = await transporter.sendMail({
            from: 'sunnypatial1985@gmail.com', // sender address
            to: emailAddr, // list of receivers
            subject: eSubj, // Subject line
            text: "", // plain text body
            html: lHtml, // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}

export default UserController