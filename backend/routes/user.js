const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config"); 
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs",
        });
    }

    try {
        const existingUser = await User.findOne({
            username: req.body.username,
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email ID already exists",
            });
        }

        const user = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        user.password = await user.createHash(req.body.password);
        await user.save();

        const userId = user._id;

        await Account.create({
            userId,
            balanceInPaise: 0,
        });

        const token = jwt.sign({ userId }, JWT_SECRET);

        res.status(201).json({
            message: "User created successfully",
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs",
        });
    }

    try {
        const user = await User.findOne({
            username: req.body.username,
        });

        if (user && (await user.validatePassword(req.body.password))) {
            const token = jwt.sign(
                { userId: user._id },
                JWT_SECRET
            );
            return res.json({
                message: "User successfully logged in",
                token: token,
            });
        } else {
            return res.status(401).json({
                message: "Incorrect username or password",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Error while updating information",
        });
    }

    try {
        await User.updateOne({ _id: req.userId }, req.body);

        res.json({
            message: "Updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

module.exports = router;
