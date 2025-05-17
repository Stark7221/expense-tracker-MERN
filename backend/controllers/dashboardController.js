const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

// Add expense to dashboard
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = isValidObjectId(userId) ? new Types.ObjectId(userId) : null;

        // Fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: '$amount' } } },
        ]);

        // Fetch total expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: '$amount' } } },
        ]);

        // Get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 }).limit(5).exec();

        const incomeLast60Days = last60DaysIncomeTransactions.reduce((acc, transaction) => {
            const date = transaction.date.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + transaction.amount;
            return acc;
        }, {});

        // Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 }).limit(5).exec();

        const expenseLast30Days = last30DaysExpenseTransactions.reduce((acc, transaction) => {
            const date = transaction.date.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + transaction.amount;
            return acc;
        }, {});

        // Fetch last 5 transactions (income + expenses)
        const lastIncomeTransactions = await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).exec();
        const lastExpenseTransactions = await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).exec();

        const lastTransactions = [
            ...lastIncomeTransactions.map(txn => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...lastExpenseTransactions.map(txn => ({
                ...txn.toObject(),
                type: "expense",
            })),
        ].sort((a, b) => b.date - a.date); // Sort latest first

        // Final response
        res.json({
            totalBalance: (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalExpense || 0),
            totalIncome: totalIncome[0]?.totalIncome || 0,
            totalExpense: totalExpense[0]?.totalExpense || 0,
            last60DaysIncomeTransactions: incomeLast60Days,
            last30DaysExpenseTransactions: expenseLast30Days,
            lastTransactions: lastTransactions.slice(0, 5),
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dashboard data',
            error: error.message,
        });
    }
};
