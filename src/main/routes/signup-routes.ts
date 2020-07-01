import {Router} from "express";

export default (router : Router) : void => {
    router.post('/signup', (req, res) => {
        res.status(200)
        res.json({ok: 'ok'})
    })
}