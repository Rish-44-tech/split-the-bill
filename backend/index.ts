import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./src/prisma.ts";
import { create } from "node:domain";
import { reverse } from "node:dns";
import { error, group } from "node:console";
import { IncomingMessage } from "node:http";
import { Decimal } from "@prisma/client/runtime/client";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Helo worl</h1>");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Server runs perfectly." });
});

app.get("/api/groups", async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const groupsForUser = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: Number(userId),
          },
        },
      },
    });
    res.status(200).json(groupsForUser);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Some error occurred. Refer console for details." });
    console.error(error);
  }
});

app.get("/api/groups/:groupId/members", async (req: Request, res: Response) => {
  const { groupId } = req.params;
  try {
    const members = await prisma.user.findMany({
      where: {
        groups: {
          some: {
            groupId: Number(groupId),
          },
        },
      },
    });
    res.status(200).json(members);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Refer console to see error occurred." });
  }
});

app.get(
  "/api/groups/:groupId/expenses",
  async (req: Request, res: Response) => {
    const { groupId } = req.params;
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          groupId: {
            equals: Number(groupId),
          },
        },
        include: {
          splits: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json(expenses);
    } catch (error: any) {
      console.error(error);
      res.status(400).json("Error!! Refer console for more details.");
    }
  },
);

app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
});

app.post("/api/groups", async (req: Request, res: Response) => {
  const { name, creatorId } = req.body;
  try {
    const newGroup = await prisma.group.create({
      data: {
        name: name,
        members: {
          create: {
            userId: Number(creatorId),
          },
        },
      },
      include: {
        members: true,
      },
    });
    res.status(201).json(newGroup);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Invalid data" });
  }
});

app.post(
  "/api/groups/:groupId/members/:userId",
  async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;
    try {
      const groupMemberAdded = await prisma.groupMember.create({
        data: {
          userId: Number(userId),
          groupId: Number(groupId),
        },
      });
      res.status(201).json(groupMemberAdded);
    } catch (error: any) {
      console.error(error);
      res
        .status(400)
        .json({ error: "Invalid data or user/group does not exist." });
    }
  },
);

app.post("/api/expenses", async (req: Request, res: Response) => {
  const { description, amount, groupId, paidById, memberIds } = req.body;
  try {
    const checkPaidMember = await prisma.groupMember.findFirst({
      where: {
        groupId: {
          equals: groupId,
        },
        userId: {
          equals: paidById,
        },
      },
    });
    if (!checkPaidMember) {
      return res.status(400).json({
        error: `Invalid request. User ${paidById} does not belong to group ${groupId}. `,
      });
    }

    const checkMembers = await prisma.groupMember.findMany({
      where: {
        groupId: Number(groupId),
      },
      select: {
        userId: true,
      },
    });

    const validMembers = checkMembers.map((user) => user.userId);
    const isValid = memberIds.every((id: number) => validMembers.includes(id));
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "One or more members are not part of the group." });
    }

    const splitAmnt = Number(amount) / memberIds.length;
    const newExpense = await prisma.expense.create({
      data: {
        desrciption: description,
        amount: Number(amount),
        groupId: Number(groupId),
        paidById: Number(paidById),
        splits: {
          createMany: {
            data: memberIds.map((userId: number) => {
              return {
                userId: userId,
                oweAmount: splitAmnt,
              };
            }),
          },
        },
      },
      include: {
        splits: true,
      },
    });
    res.status(201).json(newExpense);
  } catch (error: any) {
    res.status(400).json({ error: "" });
    console.error(error);
  }
});

app.get("/api/groups/:groupId/balance", async (req: Request, res: Response) => {
  const { groupId } = req.params;
  try {
    const expensesData = await prisma.expense.findMany({
      where: {
        groupId: {
          equals: Number(groupId),
        },
      },
      include: {
        splits: true,
      },
    });

    const membersData = await prisma.groupMember.findMany({
      where: {
        groupId: {
          equals: Number(groupId),
        },
      },
      include: {
        user: true,
      },
    });

    const setlements = await prisma.settlement.findMany({
      where:{
        groupId:{
          equals:Number(groupId)
        }
      }
    });

    let netAmounts: Record<
      number,
      { userId: number; name: String; amount: number }
    > = {};
    membersData.forEach((member) => {
      netAmounts[member.userId] = {
        userId: member.userId,
        name: member.user.name,
        amount: 0,
      };
    });
    expensesData.forEach((expense) => {
      if (netAmounts[expense.paidById]) {
        netAmounts[expense.paidById].amount += Number(expense.amount);
      }
      expense.splits.forEach((split) => {
        if (netAmounts[split.userId]) {
          netAmounts[split.userId].amount -= Number(split.oweAmount);
        }
      });
    });
    setlements.forEach((settlement)=>{
      if(netAmounts[settlement.paidById]){
        netAmounts[settlement.paidById].amount+=Number(settlement.amount);
      }
      if(netAmounts[settlement.receivedById]){
        netAmounts[settlement.receivedById].amount-=Number(settlement.amount);
      }
    })

    let oweMoney: Array<{ userId: number; name: String; amount: number }> = [];
    let getMoney: Array<{ userId: number; name: String; amount: number }> = [];

    Object.values(netAmounts).forEach((record) => {
      if (record.amount < 0.01) {
        oweMoney.push({ ...record, amount: Math.abs(record.amount) });
      } else if (record.amount > 0.01) {
        getMoney.push({ ...record });
      }
    });
    // console.log(oweMoney);
    // console.log(getMoney);
    // console.log(netAmounts);
    oweMoney.sort((a, b) => b.amount - a.amount);
    getMoney.sort((a, b) => b.amount - a.amount);

    let balanceData: Array<{
      userId: number;
      name: String;
      oweToId: number;
      oweTo: String;
      amount: number;
    }> = [];
    let p1 = 0;
    let p2 = 0;

    while (p1 < oweMoney.length && p2 < getMoney.length) {
      let payer = oweMoney[p1];
      let receiver = getMoney[p2];

      let money = Math.min(payer.amount, receiver.amount);
      balanceData.push({
        userId: payer.userId,
        name: payer.name,
        oweToId: receiver.userId,
        oweTo: receiver.name,
        amount: Number(money.toFixed(2)),
      });

      payer.amount -= money;
      receiver.amount -= money;

      if (payer.amount < 0.01) {
        p1++;
      }
      if (receiver.amount < 0.01) {
        p2++;
      }
    }

    if (p1 != oweMoney.length || p2 != getMoney.length) {
      throw new Error("Failed to balance cleanly");
    }

    res.status(200).json(balanceData);
  } catch (error: any) {
    res.status(400).json({
      error: "Some error occurred. Refer to console for more details.",
    });
    console.error(error);
  }
});

app.get("/api/:userId/activity", async (req: Request, res: Response) => {
  const { recent, filter } = req.query;
  const { userId } = req.params;
  try {
    let userData;
    const groupName = String(filter);
    if (groupName === "all") {
      userData = await prisma.user.findFirst({
        where: {
          id: {
            equals: Number(userId),
          },
        },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  expenses: {
                    include: {
                      splits: true,
                    },
                    orderBy:[
                      {
                        createdAt:"desc"
                      }
                    ]
                  },
                  members: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      userData = await prisma.user.findFirst({
        where: {
          id: {
            equals: Number(userId),
          },
        },
        include: {
          groups: {
            where:{
                group:{
                    name:{
                        equals:groupName
                    }
                }
            },
            include: {
              group: {
                include: {
                  expenses: {
                    include: {
                      splits: true,
                    },
                    orderBy:[
                      {
                        createdAt:"asc"
                      }
                    ]
                  },
                  members: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if(!userData){
        throw new Error("Group not found");
      }
    }

    let activityData: Array<{
      expenseId?: number;
      description?: string;
      group?: string;
      createdBy?: string;
      nature?: string;
      amount?: number;
      createdAt?: Date;
    }> = [];

    let recentActData: Array<{
      expenseId?: number;
      description?: string;
      group?: string;
      createdBy?: string;
      createdAt?: Date;
    }> = [];

    const allGroups = userData?.groups;
    allGroups?.forEach((group) => {
      group.group.expenses.forEach((expense) => {
        let details: {
          expenseId?: number;
          description?: string;
          group?: string;
          createdBy?: string;
          nature?: string;
          amount?: number;
          createdAt?: Date;
        } = {};

        details.expenseId = expense.id;
        details.description = expense.desrciption;

        details.group = allGroups?.find(
          (thisGroup) => thisGroup.groupId === expense.groupId,
        )?.group.name;

        details.createdBy = group.group.members.find(
          (member) => member.user.id === expense.paidById,
        )?.user.name;
        details.createdAt = expense.createdAt;

        const splitSec = expense.splits.find(
          (element) => element.userId === Number(userId),
        );
        const split: number = Number(splitSec?.oweAmount);
        if (expense.paidById === Number(userId) && split) {
          details.createdBy = "You";
          details.nature = (splitSec?.oweAmount && Number(splitSec?.oweAmount)-split!=0)?"You are owed":"NULL";
          details.amount = Number((Number(expense.amount) - split).toFixed(2));
        } else if (split) {
          details.nature = "You owe";
          details.amount = Number(split.toFixed(2));
        } else {
          details.nature = "NULL";
          details.amount = 0;
        }
        activityData.push(details);

        if (recentActData.length <= 4) {
          recentActData.push({
            expenseId: details.expenseId,
            description: details.description,
            group: details.group,
            createdBy: details.createdBy,
            createdAt: details.createdAt,
          });
        }
      });
    });

    if (String(recent).toLowerCase() === "true") {
      return res.status(200).json(recentActData);
    }
    res.status(200).json(activityData);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "could not fetch data" });
  }
});

app.post("/api/groups/:groupId/settlements",async (req:Request,res:Response)=>{
  const {paidById,receivedById,amnt}=req.body;
  const {groupId}=req.params;

  try{
    const checkPaid=await prisma.groupMember.findFirst({
      where:{
        groupId:{
          equals:Number(groupId)
        },
        userId:{
          equals:paidById
        }
      }
    });
    const checkReceived=await prisma.groupMember.findFirst({
      where:{
        groupId:{
          equals:Number(groupId)
        },
        userId:{
          equals:receivedById
        }
      }
    });

    if(!checkPaid || !checkReceived || amnt<=0){
      return res.status(400).json({error:"check body inputs"});
    }

    if(paidById===receivedById){
      return res.status(400).json({error:"Cannot settle with yourself"});
    }
    const newSettlement= await prisma.settlement.create({
      data:{
        amount:amnt,
        paidById:paidById,
        receivedById:receivedById,
        groupId:Number(groupId)
      }
    });

    res.status(201).json({newSettlement});

    
  }
  catch(error:any){
    console.error(error);
    res.status(400).json({error:"refer console for error"});
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
