import express from "express";
import cors from "cors";
import {Innertube, Platform} from "youtubei.js";
import fs from "fs";
Platform.shim.eval = async (e)=>{
    return new Function(e.output)();
}
const app = express();
app.use(cors());
async function tast(){
    let cookies = [];
    cookies = JSON.parse(fs.readFileSync("./cookies.json", "utf-8"));
    let cst = "";
    for (const c of cookies){
        cst += `${c.name}=${c.value};`;
    }
    cst = cst.slice(0, -1)
    const yot = await Innertube.create({cookie: cst});
    return yot;
}
tast();
app.listen(process.env.PORT || 3000, "0.0.0.0", ()=>{});
app.get("/download", async (req, res)=>{
    try {
        const yt = await tast();
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
