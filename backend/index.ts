import express from 'express';
import type {Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import {prisma} from './src/prisma.ts';
import { create } from 'node:domain';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/',(req:Request,res:Response)=>{
    res.send('<h1>Helo worl</h1>');
})

app.get('/api/health', (req: Request, res: Response) => {
    res.json({status:"Server runs perfectly."});
});

app.post('/api/users', async (req:Request,res:Response)=>{
    const {name,email}=req.body;
    try{
        const newUser=await prisma.user.create({
            data: {name,email}
        });
        res.status(201).json(newUser);
    } catch(error:any){
        console.error(error);
        res.status(400).json({error:"Email already exists or invalid data"});
    }
})

app.post('/api/groups', async (req:Request,res:Response)=>{
    const {name,creatorId}=req.body;
    try{
        const newGroup=await prisma.group.create({
            data: {
                name:name,
                members:{
                    create:{
                        userId:Number(creatorId)
                    }
                }
            },
            include:{
                members:true
            }
        });
        res.status(201).json(newGroup);
    } catch(error:any){
        console.error(error);
        res.status(400).json({error:"Invalid data"});
    }
})

app.post('/api/expenses',async (req:Request,res:Response)=>{
    const {description,amount,groupId,paidById,memberIds}=req.body;
    try{
        const splitAmnt=Number(amount)/memberIds.length;
        const newExpense=await prisma.expense.create({
            data:{
                desrciption:description,
                amount:Number(amount),
                groupId:Number(groupId),
                paidById:Number(paidById),
                splits:{
                    createMany:{
                        data:memberIds.map((userId:number)=>{
                            return {
                                userId:userId,
                                oweAmount:splitAmnt
                            }
                        })
                    }
                }
            },
            include:{
                splits:true
            }
        });
        res.status(201).json(newExpense);
    } catch(error:any){
        res.status(400).json({error:""});
        console.error(error);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});