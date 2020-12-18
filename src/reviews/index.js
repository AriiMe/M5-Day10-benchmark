const express = require("express");
const path = require("path");
const { join } = require("path");
const { writeDB, readDB } = require("../fsUtilities");
const uniqid = require("uniqid");

const reviewsJsonPath = path.join(__dirname, "reviews.json");

const reviewsJsonPath = express.Router();

reviewsRouter.get("/", async (req, res) => {
    try {
        let reviews = await readDB(reviewsJsonPath)
        res.send(reviews)
    } catch (error) {
        const err = new Error("error with get")
    }
})
reviewsRouter.get("/:id", async (req, res) => {
    try {
        let reviews = await readDB(reviewsJsonPath)
        let filteredArray = reviews.filter((review) => review.elementId === req.params.id)

        res.send(filteredArray)
    } catch (error) {
        const err = new Error("problem with filtered get")
    }
})
