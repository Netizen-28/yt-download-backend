import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";
const app = express();
app.use(cors());
app.listen(process.env.PORT || 3000, "0.0.0.0", ()=>{});
app.get("/download", async (req, res)=>{
    try {
        res.setHeader("Content-Disposition", `attachment; filename="${req.query.id}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");
        ytdl(`https://youtube.com/watch?v=${req.query.id}`, {
            filter: "audioandvideo",
            quality: "lowestvideo"
        }).pipe(res);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});