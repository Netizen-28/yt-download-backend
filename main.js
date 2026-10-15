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
            quality: "lowestvideo",
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive'
                }
            }
        }).pipe(res);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});
