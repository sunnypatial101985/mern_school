import Page_Categorie from "../model/PageCategory.js"

class PageCategoryController {
    static getPageCategory = async(req, res) => {
        await Page_Categorie.find().sort("name").then((docs) => {
            res.send(docs)
        }).catch((error) => {
            res.send(error)
        })
    }
    static postPageCategory = async(req, res) => {
        const { name, active } = req.body
        try {
            let pObj = new Page_Categorie()
            pObj.name = name
            pObj.active = active
            let result = await pObj.save()
            res.send(result)
        } catch (error) {
            res.send(error)
        }

    }
}

export default PageCategoryController