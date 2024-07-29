const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');

const router = express.Router();

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

        if (!fromAccount) {
            throw new Error("Account not found");
        }
        if ((fromAccount.balanceInPaise)/100 < amount) {
            throw new Error("Insufficient balance");
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            throw new Error("Invalid account");
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balanceInPaise: -(amount*100) } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balanceInPaise: amount*100 } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

router.get("/auth", authMiddleware, (req, res) => {
    res.json({ userId: req.userId });
});

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json({ balance: account.balanceInPaise /100});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/deposit", authMiddleware, async (req, res) => {
    const { amount } = req.body;
    await Account.updateOne({ userId: req.userId }, { $inc: { balanceInPaise: amount } });
    res.json({ message: "Deposit successful" });
});

module.exports = router;