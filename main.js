import express from "express";
import cors from "cors";
import {Innertube, Platform} from "youtubei.js";
Platform.shim.eval = async (e)=>{
    return new Function(e.output)();
}
const app = express();
app.use(cors());
let yt;
async function tast(){
    yt = await Innertube.create();
}
tast();
app.listen(process.env.PORT || 3000, "0.0.0.0", ()=>{});
app.get("/download", async (req, res)=>{
    try {
        const chk = await yt.download(req.query.id, {
            type: "video+audio",
            quality: "240p",
            format: "mp4",
            client: "ANDROID"
        });
        res.setHeader("Content-Disposition", `attachment; filename="${req.query.id}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");
        for await (const chunk of chk){
            res.write(chunk);
        }
        res.end();
    } catch (e) {
        return res.status(500).send(e.message);
    }
});