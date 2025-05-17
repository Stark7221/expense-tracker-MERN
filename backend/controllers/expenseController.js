const XLSX = require("xlsx");
const User = require("../models/User");
const Expense = require("../models/Expense");


//add expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const {icon ,category, amount, date} = req.body;
        
        //validate the data
        if (!category || !amount || !date) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date), //
        });
        await newExpense.save();
        res.status(201).json({newExpense});
    } 
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

//get all expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.status(200).json({expense});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

//delete expense Source
exports.deleteExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense Source deleted successfully"});   
    } 
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

//download expense Source in excel format
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        
        const data = expense.map((item) => {
            return {
                category: item.category,
                amount: item.amount,
                date: item.date.toLocaleDateString("en-US"),
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Expense");
        XLSX.writeFile(wb, "Expense.xlsx");
        res.download("Expense.xlsx", (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("File downloaded successfully");
            }
        });

    } 
    catch (error) {
       res.status(500).json({message: "Internal server error"}); 
    }

}