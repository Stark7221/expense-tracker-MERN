const XLSX = require("xlsx");
const User = require("../models/User");
const Income = require("../models/Income");


//add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const {icon ,source, amount, date} = req.body;
        
        //validate the data
        if (!source || !amount || !date) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date), //
        });
        await newIncome.save();
        res.status(201).json({newIncome});
    } 
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

//get all Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.status(200).json({income});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

//delete Income Source
exports.deleteIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income Source deleted successfully"});   
    } 
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

//download Income Source in excel format
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({userId}).sort({date: -1});
        
        const data = income.map((item) => {
            return {
                source: item.source,
                amount: item.amount,
                date: item.date.toLocaleDateString("en-US"),
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Income");
        XLSX.writeFile(wb, "Income.xlsx");
        res.download("Income.xlsx", (err) => {
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