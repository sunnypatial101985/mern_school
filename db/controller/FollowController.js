import Follow from "../model/follow.js";

class FollowController {
    static getFollows = async(req, res) => {
        await Follow.find().sort("icon_name").then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
    static postFollows = async(req, res) => {
        const { icon_name, social_link, sequence, active } = req.body
        try {
            let fObj = new Follow()
            fObj.icon_name = icon_name
            fObj.social_link = social_link
            fObj.sequence = sequence
            fObj.active = active
            let result = await fObj.save()
            res.send(result)
        } catch (error) {
            res.send(error)
        }
    }
    static updateFollow = async(req, res) => {
        let id = req.params.id
        await Follow.findOneAndUpdate({ _id: id }, { $set: req.body }).then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
    static deleteFollow = async(req, res) => {
        let id = req.params.id
        await Follow.findOneAndDelete({ _id: id }).then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
}

export default FollowController