/** @format */

const express = require("express");
const uniqid = require("uniqid");
const multer = require("multer");
const upload = multer({});
const { readMedia, writeMedia } = require("../utilities/utilities");
const { writeFile, writeJson } = require("fs-extra");
const { join, extname } = require("path");
const mediaRouter = express.Router();


const mediaImagesPath = join(__dirname, "../../images");

mediaRouter.get("/", async (req, res, next) => {
    try {
        const mediaDB = await readMedia();
        console.log(mediaDB);
        res.send(mediaDB);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

mediaRouter.get("/:mediaID", async (req, res, next) => {
    try {
        const mediaDB = await readMedia();
        const singleMedia = mediaDB.find(
            (media) => media.imdbID === req.params.mediaID
        );
        if (singleMedia) {
            res.send(singleMedia);
        } else {
            console.log(error);
            next(error);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

mediaRouter.post("/", async (req, res, next) => {
    try {
        const mediaDB = await readMedia();
        mediaDB.push(req.body);
        await writeMedia(mediaDB);
        res.send("Added!");
    } catch (error) {
        console.log(error);
        next(error);
    }
});

mediaRouter.post("/:mediaID", async (req, res, next) => {
    try {
        const mediaDB = await readMedia();
        const singleMedia = mediaDB.findIndex(
            (media) => media.imdbID === req.params.mediaID
        );
        if (singleMedia !== -1) {
            mediaDB[singleMedia] = req.body;
            await writeMedia(mediaDB);
            res.send("medi edited");
        } else {
            console.log(error);
            next(error);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

mediaRouter.delete("/:mediaID", async (req, res, next) => {
    try {
        const mediaDB = await readMedia();
        const singleMedia = mediaDB.find(
            (media) => media.imdbID === req.params.mediaID
        );
        if (singleMedia) {
            const filteredMediaDB = mediaDB.filter(
                (media) => media.imdbID !== req.params.mediaID
            );
            await writeMedia(filteredMediaDB);
            res.send("Deleted!");
        } else {
            console.log(error);
            next(error);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});


//image upload
mediaRouter.post("/:mediaID/upload", upload.single("mediaPoster"),
    async (req, res, next) => {
        try {
            const mediaDB = await readMedia();
            const singleMediaIndex = mediaDB.findIndex(
                (media) => media.imdbID === req.params.mediaID
            );
            if (singleMediaIndex !== -1) {
                const imageName = req.params.mediaID + extname(req.file.originalname);
                try {
                    await writeFile(join(mediaImagesPath, imageName), req.file.buffer);
                    mediaDB[singleMediaIndex].Poster =
                        "http://localhost:3001/images/" + imageName;
                    await writeMedia(mediaDB);
                    res.send("Poster Added!");
                } catch (error) {
                    console.log(error);
                    next(error);
                }
            } else {
                const err = new Error();
                err.httpStatusCode = 404;
                next(err);
            }
        } catch (error) {
            console.log(error);
            next(err);
        }
    }
);

module.exports = mediaRouter;