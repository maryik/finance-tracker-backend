import BudgetModel from "../models/Budget.js";
import { ExpenseModel, PayModel } from "../models/Expense.js";

export const addBudget = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.userId;

        const budget = new BudgetModel({ userId, amount });
        await budget.save();

        res.status(200).json({ message: "", budget });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось добавить бюджет",
        });
    }   
};

export const getBudget = async (req, res) => {
    try {
        const userId = req.userId; // Извлекаем userId из токена, предполагается, что он уже аутентифицирован
        const budget = await BudgetModel.findOne({ userId }); // Ищем бюджет по userId

        if (!budget) {
            return res.status(404).json({ msg: 'У вас пока нет бюджета, добавьте его' });
        }

        res.status(200).json({ amount: budget.amount });
    } catch (err) {
        console.error('Ошибка при получении бюджета:', err);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};
    
export const addExpense = async (req, res) => {
    try {
        const { amount, title, date } = req.body;
        const userId = req.userId;

        const expense = new ExpenseModel({ userId, amount, title, date });
        await expense.save();
        
        const budget = await BudgetModel.findOne({ userId });
        if(budget){
            budget.amount -= amount;
            await budget.save();
        }

        res.status(200).json({ message: "Расход успешно добавлен", expense });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось добавить расход",
        });
    }
};

export const addPay = async (req, res) => {
    try {
        const { amount, title, date } = req.body;
        const userId = req.userId;

        const expense = new PayModel({ userId, amount, title, date });
        await expense.save();
        
        const budget = await BudgetModel.findOne({ userId });
        if(budget){
            budget.amount += amount;
            await budget.save();
        }

        res.status(200).json({ message: "Прибыль успешно добавлена", expense });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось добавить прибыль",
        });
    }
};

export const getAllExpensesAndPays = async (req, res) => {
    try {
        const userId = req.userId;
        const expenses = await ExpenseModel.find({ userId });
        const pays = await PayModel.find({ userId });
        res.status(200).json({ expenses, pays });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить данные",
        });
    }
};
