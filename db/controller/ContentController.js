import Content from "../model/content.js"

class ContentController {
    static getContent = async(req, res) => {
        await Content.find().sort("sequence").then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
    static getPageContentByPageId = async(req, res) => {
        await Content.find({ page_cat_id: req.params.id }).populate("page_cat_id").sort("sequence").then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
    static postContent = async(req, res) => {
        const { title, description, pic, page_cat_id, sequence, active } = req.body
        try {
            let cObj = new Content()
            cObj.title = title
            cObj.description = description
            cObj.pic = pic
            cObj.page_cat_id = page_cat_id
            cObj.sequence = sequence
            cObj.active = active
            let result = await cObj.save()
            res.send(result)
        } catch (error) {
            res.send(error)
        }
    }
    static updateContent = async(req, res) => {
        let id = req.params.id
        await Content.findOneAndUpdate({ _id: id }, { $set: req.body }).then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
    static deleteContent = async(req, res) => {
        let id = req.params.id
        await Content.findOneAndDelete({ _id: id }).then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
}

export default ContentController