import moment from "moment";
import BudgetModel from "../models/Budget.js";
import { Goal } from "../models/Goal.js";

const checkGoalsPeriodically = () => {
    setInterval(async () => {
        try {
            const goals = await Goal.find();
            goals.forEach(goal => {
                goal.checkDeadline();
            });
            await Promise.all(goals.map(goal => goal.save()));
            console.log('Статус целей проверен и обновлён');
        } catch (err) {
            console.error('Ошибка при проверке статуса целей:', err);
        }
    }, 60000);
};

checkGoalsPeriodically();

export const addGoalWithCheck = async (req, res) => {
    await checkGoalStatus(req, res, async () => {
        try {
            const { title, description, price, deadline } = req.body;
            const userId = req.userId;

            const formattedDeadline = moment(deadline, "DD:MM:YYYY").toISOString();

            const goal = new Goal({
                userId,
                title,
                description,
                price,
                deadline: formattedDeadline,
            });

            await goal.save();
            res.status(201).json({ message: "Цель успешно добавлена", goal });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Не удалось добавить цель" });
        }
    });
};

export const checkGoalStatus = async (req, res, next) => {
    try {
        const goals = await Goal.find();

        goals.forEach(goal => {
            goal.checkDeadline();
        });

        await Promise.all(goals.map(goal => goal.save()));

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Не удалось проверить статус целей" });
    }
};

export const getAll = async (req, res) => {
    try {
        const userId = req.userId; // Или используйте req.user._id, в зависимости от вашей структуры
        const goals = await Goal.find({ userId }); // Фильтрация по userId
        res.status(200).json({ goals });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Не удалось получить цели" });
    }
};

export const completeGoal = async (req, res) => {
    try {
        const goalId = req.params.goalId;
        const goal = await Goal.findById(goalId);

        if (!goal) {
            return res.status(404).json({ msg: 'Цель не найдена' });
        }

        if (goal.isCompleted) {
            return res.status(400).json({ msg: 'Цель уже завершена' });
        }

        const userId = req.userId;

        const budget = await BudgetModel.findOne({ userId });

        if (!budget) {
            return res.status(404).json({ msg: 'Бюджет пользователя не найден' });
        }

        if (budget.amount < goal.price) {
            return res.status(400).json({ msg: 'Недостаточно средств для завершения цели' });
        }

        goal.isCompleted = true;
        await goal.save();

        budget.amount -= goal.price;
        await budget.save();

        res.status(200).json({ message: 'Цель успешно завершена', goal, updatedBudget: budget });
    } catch (err) {
        console.error('Ошибка при завершении цели:', err);
        res.status(500).json({ msg: 'Не удалось завершить цель' });
    }
};