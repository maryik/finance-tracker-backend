import mongoose from "mongoose";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { loginValidation, registerValidation, expensePayValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js"; 
import handleValidationErrors from "./utils/handleValidationErrors.js";

import { register, login, getMe } from "./controllers/UserController.js";
import { addBudget, getBudget,addExpense, addPay, getAllExpensesAndPays } from "./controllers/BudgetController.js";
import { addGoalWithCheck, getAll, completeGoal } from "./controllers/GoalController.js";

const app = express();

mongoose.connect(
    'mongodb+srv://vova:basketballmarata@clustertrpoproject.oxbza.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTRPOProject',
).then(()=>console.log('DB OKEY'))
.catch((err)=>console.log('DB ERROR', err));

const corsOptions = {
    origin: 'http://localhost:3000', // Разрешите только запросы с этого источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Разрешите отправку cookie
};

app.use(cors(corsOptions));

app.use(express.json());

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post("/auth/register", registerValidation, handleValidationErrors, register);
app.get("/auth/me", checkAuth, getMe);


app.post("/budget/add", checkAuth, addBudget);
app.get("/budget/get", checkAuth, getBudget);
app.post("/budget/addExpense", expensePayValidation, handleValidationErrors, checkAuth, addExpense);
app.post("/budget/addPay", expensePayValidation, handleValidationErrors, checkAuth, addPay);
app.get("/budget/getAllExpensesAndPays", checkAuth, getAllExpensesAndPays);

app.post("/goals/add", checkAuth, addGoalWithCheck);
app.get("/goals/getAll", checkAuth, getAll);
app.put("/goals/:goalId/complete", checkAuth, completeGoal);

app.listen(5555, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server is cool');
});