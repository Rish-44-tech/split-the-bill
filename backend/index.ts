// LEGEND (comments in this file mark what changed in the auth update):
//   [NEW]     = added
//   [CHANGED] = existed before, modified
//   [REMOVED] = deleted; the comment sits where the code used to be

import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import cookieParser from "cookie-parser"; 
import { prisma } from "./src/prisma.ts";

const app = express();
const PORT = process.env.PORT || 3000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Add it to your .env file.`);
  }
  return value;
}

const JWT_SECRET = requireEnv("JWT_SECRET"); // [NEW]

const cookieOptions = {
  httpOnly: true, // JS in the page can't read the cookie (protects against XSS theft)
  sameSite: "lax" as const, // blocks the cookie on most cross-site requests (CSRF)
  secure: process.env.NODE_ENV === "production",
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 


function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  let payload: { id: number };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { id: number };
  } catch {
    return res.status(401).json({ error: "Invalid or expired session." });
  }

  if (typeof payload.id !== "number") {
    return res.status(401).json({ error: "Invalid session." });
  }

  req.user = { id: payload.id };
  next();
}

// 401 = we don't know who you are; 403 = we know, but you're not allowed.
async function requireGroupMember(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const groupId = Number(req.params.groupId);
  if (!Number.isInteger(groupId)) {
    return res.status(400).json({ error: "Invalid group id." });
  }
  try {
    const membership = await prisma.groupMember.findFirst({
      where: { groupId, userId: req.user!.id },
    });
    if (!membership) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group." });
    }
    next();
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Could not verify group membership." });
  }
}


app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Helo worl</h1>");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Server runs perfectly." });
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 72
  ) {
    return res.status(400).json({
      error: "Name, email, and a password of 8-72 characters are required."
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already registered." });
    }
    console.error(error);
    res.status(400).json({ error: "Could not register." });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // [CHANGED] spreads the shared cookieOptions instead of repeating the flags inline
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Could not sign in." });
  }
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out." });
});

app.use("/api", requireAuth);

app.get("/api/auth/me", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Could not fetch user." });
  }
});

async function getBalanceData(groupId: number) {
  const groupDets = await prisma.group.findFirst({
    where: { id: { equals: Number(groupId) } },
  });

  if (!groupDets) {
    throw new Error("Group not found.");
  }

  const groupName = groupDets.name;

  const expensesData = await prisma.expense.findMany({
    where: { groupId: { equals: Number(groupId) } },
    include: { splits: true },
  });

  const membersData = await prisma.groupMember.findMany({
    where: { groupId: { equals: Number(groupId) } },
    include: { user: { select: { name: true } } }, // [CHANGED] was `user: true`; only the name is used, so passwordHash is never loaded
  });

  const setlements = await prisma.settlement.findMany({
    where: { groupId: { equals: Number(groupId) } },
  });

  let netAmounts: Record<
    number,
    { userId: number; name: string; amount: number }
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
  setlements.forEach((settlement) => {
    if (netAmounts[settlement.paidById]) {
      netAmounts[settlement.paidById].amount += Number(settlement.amount);
    }
    if (netAmounts[settlement.receivedById]) {
      netAmounts[settlement.receivedById].amount -= Number(settlement.amount);
    }
  });

  let oweMoney: Array<{ userId: number; name: string; amount: number }> = [];
  let getMoney: Array<{ userId: number; name: string; amount: number }> = [];

  Object.values(netAmounts).forEach((record) => {
    if (record.amount < -0.01) {
      oweMoney.push({ ...record, amount: Math.abs(record.amount) });
    } else if (record.amount > 0.01) {
      getMoney.push({ ...record });
    }
  });
  oweMoney.sort((a, b) => b.amount - a.amount);
  getMoney.sort((a, b) => b.amount - a.amount);

  let balanceData: Array<{
    userId: number;
    name: string;
    oweToId: number;
    oweTo: string;
    amount: number;
    groupName: string;
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
      groupName: groupName,
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
    throw new Error("error occured. could not calculate balance");
  }
  return balanceData;
}


app.get("/api/groups", async (req: Request, res: Response) => {
  try {
    const groupsForUser = await prisma.group.findMany({
      where: { members: { some: { userId: req.user!.id } } },
    });
    res.status(200).json(groupsForUser);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Some error occurred. Refer console for details." });
    console.error(error);
  }
});

app.post("/api/groups", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Group name is required." });
  }
  try {
    const newGroup = await prisma.group.create({
      data: {
        name: name.trim(), 
        members: { create: { userId: req.user!.id } },
      },
      include: { members: true },
    });
    res.status(201).json(newGroup);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Invalid data" });
  }
});

app.get("/api/groups/:groupId/members",
  requireGroupMember, 
  async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId);
    try {
      const members = await prisma.user.findMany({
        where: { groups: { some: { groupId } } },
        select: { id: true, name: true, email: true },
      });
      res.status(200).json(members);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: "Refer console to see error occurred." });
    }
  },
);

app.post("/api/groups/:groupId/members",
  requireGroupMember, 
  async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId);
    const { emailId } = req.body;

    if (typeof emailId !== "string" || !emailId.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { email: emailId.trim().toLowerCase() },
      });
      if (!user) {
        return res.status(404).json({ error: "User does not exist." });
      }

      const checkGroup = await prisma.groupMember.findFirst({
        where: { groupId, userId: user.id },
      });
      if (checkGroup) {
        return res.status(409).json({ error: "Member already exists in group." });
      }

      const groupMemberAdded = await prisma.groupMember.create({
        data: { userId: user.id, groupId },
        include: { user: { select: { id: true, name: true, email: true } } },
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

app.get("/api/groups/:groupId/expenses",
  requireGroupMember, 
  async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId);
    try {
      const expenses = await prisma.expense.findMany({
        where: { groupId },
        include: { paidBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(expenses);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: "Could not fetch expenses." });
    }
  },
);

app.post("/api/groups/:groupId/expenses", //to be done
  requireGroupMember,
  async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId); // [CHANGED] from the URL, no longer from req.body
    const { description, amount, paidById, memberIds } = req.body;

    // [NEW] coerce and sanitize input
    const total = Number(amount);
    const payerId = Number(paidById);
    const ids: number[] = Array.isArray(memberIds)
      ? [...new Set(memberIds.map(Number))] // dedupe so nobody is charged twice
      : [];

    // [NEW] validation. Also prevents divide-by-zero when memberIds was empty.
    if (
      typeof description !== "string" ||
      !description.trim() ||
      !Number.isFinite(total) ||
      total <= 0 ||
      !Number.isInteger(payerId) ||
      ids.length === 0 ||
      !ids.every(Number.isInteger)
    ) {
      return res.status(400).json({ error: "Invalid expense details." });
    }

    try {
      // [CHANGED] one query replaces the old checkPaidMember + checkMembers pair
      const groupMembers = await prisma.groupMember.findMany({
        where: { groupId },
        select: { userId: true },
      });
      const memberSet = new Set(groupMembers.map((m) => m.userId));

      if (!memberSet.has(payerId)) {
        return res.status(400).json({
          error: `Invalid request. User ${payerId} does not belong to group ${groupId}.`,
        });
      }
      if (!ids.every((id) => memberSet.has(id))) {
        return res
          .status(400)
          .json({ error: "One or more members are not part of the group." });
      }

      // [REMOVED] `memberIdsFiltered` (declared but never used)
      const splitAmnt = total / ids.length;
      const newExpense = await prisma.expense.create({
        data: {
          desrciption: description.trim(), // [CHANGED] trimmed (field name typo is in the schema, so unchanged)
          amount: total,
          groupId,
          paidById: payerId,
          splits: {
            createMany: {
              data: ids.map((userId) => ({ userId, oweAmount: splitAmnt })),
            },
          },
        },
        include: { splits: true },
      });
      res.status(201).json(newExpense);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: "Could not create expense." }); // [CHANGED] was `{ error: "" }`, an empty message
    }
  },
);


app.get("/api/groups/:groupId/balance", //to be done
  requireGroupMember, // [NEW]
  async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId);
    // [REMOVED] ~90 lines of commented-out old balance code that used to sit here
    try {
      const balanceData = await getBalanceData(groupId); // [CHANGED] `var` became `const`
      res.status(200).json(balanceData);
    } catch (error: any) {
      res.status(400).json({
        error: "Some error occurred. Refer to console for more details.",
      });
      console.error(error);
    }
  },
);


app.get("/api/balance",  //to be done
  async (req: Request, res: Response) => {
  const userId = req.user!.id; // [CHANGED] was `req.params.userId`; every `Number(userId)` below became plain `userId`
  try {
    // [REMOVED] the "does this user exist" lookup. The id comes from a verified token,
    // and a nonexistent user simply has no groups (handled just below).
    const groupDet = await prisma.groupMember.findMany({
      where: { userId },
    });

    if (groupDet.length === 0) {
      return res.status(200).json([[], 0, 0]);
    }

    let owedSummary: Array<{
      id: number;
      oweOrOwed: string;
      amount: number;
      otherId: number;
      other: string;
      group: string[];
    }> = [];

    let num = 0;
    await Promise.all(
      groupDet.map(async (group) => {
        const balanceData = await getBalanceData(group.groupId);
        balanceData?.forEach((data) => {
          if (data.userId !== userId && data.oweToId !== userId) { // [CHANGED] `!=` became `!==`
            return;
          }
          const entry = owedSummary.find(
            (entry) =>
              entry.otherId === data.userId || entry.otherId === data.oweToId,
          );
          if (entry) {
            if (!entry.group.includes(data.groupName)) {
              entry.group.push(data.groupName);
            }
            if (entry.oweOrOwed === "owe") {
              if (data.oweToId === userId) {
                if (data.amount - entry.amount > 0.01) {
                  entry.oweOrOwed = "owed";
                  entry.amount = data.amount - entry.amount;
                } else if (data.amount - entry.amount < -0.01) {
                  entry.amount = entry.amount - data.amount;
                } else {
                  owedSummary.splice(owedSummary.indexOf(entry), 1);
                }
              } else if (data.userId === userId) {
                entry.amount += data.amount;
              }
            } else {
              if (data.userId === userId) {
                if (data.amount - entry.amount > 0.01) {
                  entry.oweOrOwed = "owe";
                  entry.amount = data.amount - entry.amount;
                } else if (data.amount - entry.amount < -0.01) {
                  entry.amount = entry.amount - data.amount;
                } else {
                  owedSummary.splice(owedSummary.indexOf(entry), 1);
                }
              } else if (data.oweToId === userId) {
                entry.amount += data.amount;
              }
            }
            entry.amount = Number(entry.amount.toFixed(2));
            return;
          }
          if (data.oweToId === userId) {
            owedSummary.push({
              id: ++num,
              oweOrOwed: "owed",
              amount: Number(data.amount.toFixed(2)),
              other: data.name,
              otherId: data.userId,
              group: [data.groupName],
            });
          } else if (data.userId === userId) {
            owedSummary.push({
              id: ++num,
              oweOrOwed: "owe",
              amount: Number(data.amount.toFixed(2)),
              other: data.oweTo,
              otherId: data.oweToId,
              group: [data.groupName],
            });
          }
        });
      }),
    );

    let totalOwe = 0;
    let totalOwed = 0;
    owedSummary.forEach((element) => {
      if (element.oweOrOwed === "owe") {
        totalOwe += element.amount;
      } else {
        totalOwed += element.amount;
      }
    });
    let outputFinal = [
      owedSummary,
      Number(totalOwe.toFixed(2)),
      Number(totalOwed.toFixed(2)),
    ];
    return res.status(200).json(outputFinal);
  } catch (error: any) {
    res.status(400).json({
      error: "some error occurred. refer console for more details.",
    });
    console.error(error);
  }
});

app.get("/api/activity",  //to be done
  async (req: Request, res: Response) => {
  const userId = req.user!.id; // [CHANGED] was `req.params.userId`; every `Number(userId)` below became plain `userId`
  const { recent } = req.query; // [CHANGED] no longer destructures `filter` here
  const groupName = String(req.query.filter ?? "all"); // [CHANGED] defaults to "all" (a missing filter used to become the string "undefined" and match nothing)
  try {
    let userData;
    if (groupName === "all") {
      userData = await prisma.user.findFirst({
        where: { id: { equals: userId } },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  expenses: { include: { splits: true } },
                  members: {
                    include: { user: { select: { id: true, name: true } } }, // [CHANGED] was `user: true`; only id and name are used
                  },
                },
              },
            },
          },
        },
      });
    } else {
      userData = await prisma.user.findFirst({
        where: { id: { equals: userId } },
        include: {
          groups: {
            where: { group: { name: { equals: groupName } } },
            include: {
              group: {
                include: {
                  expenses: { include: { splits: true } },
                  members: {
                    include: { user: { select: { id: true, name: true } } }, // [CHANGED] same as above
                  },
                },
              },
            },
          },
        },
      });
      if (!userData) {
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
          (element) => element.userId === userId, // [CHANGED] was Number(userId)
        );
        const split: number = Number(splitSec?.oweAmount);
        if (expense.paidById === userId && split) { // [CHANGED] was Number(userId)
          details.createdBy = "You";
          details.nature =
            splitSec?.oweAmount && Number(splitSec?.oweAmount) - split != 0
              ? "You are owed"
              : "NULL";
          details.amount = Number((Number(expense.amount) - split).toFixed(2));
        } else if (split) {
          details.nature = "You owe";
          details.amount = Number(split.toFixed(2));
        } else {
          details.nature = "NULL";
          details.amount = 0;
        }
        activityData.push(details);

        recentActData.push({
          expenseId: details.expenseId,
          description: details.description,
          group: details.group,
          createdBy: details.createdBy,
          createdAt: details.createdAt,
        });
      });
    });
    activityData.sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
    recentActData.sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
    recentActData.splice(4);
    if (String(recent).toLowerCase() === "true") {
      return res.status(200).json(recentActData);
    }
    res.status(200).json(activityData);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "could not fetch data" });
  }
});

app.post("/api/groups/:groupId/settlements", //to be done
  requireGroupMember, // [NEW]
  async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId);
    const { paidById, receivedById, amnt } = req.body;

    // [NEW] coerce body values to numbers (ids and amount can arrive as strings)
    const payerId = Number(paidById);
    const receiverId = Number(receivedById);
    const amount = Number(amnt);

    // [CHANGED] stricter validation than the old `amnt <= 0` check alone
    if (
      !Number.isInteger(payerId) ||
      !Number.isInteger(receiverId) ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({ error: "check body inputs" });
    }
    // [NEW] you can't settle with yourself
    if (payerId === receiverId) {
      return res.status(400).json({ error: "Cannot settle with yourself." });
    }

    try {
      // [CHANGED] one count query replaces the two separate findFirst checks.
      // Both people must belong to this group.
      const memberCount = await prisma.groupMember.count({
        where: { groupId, userId: { in: [payerId, receiverId] } },
      });
      if (memberCount !== 2) {
        return res.status(400).json({ error: "check body inputs" });
      }

      const newSettlement = await prisma.settlement.create({
        data: {
          amount,
          paidById: payerId,
          receivedById: receiverId,
          groupId,
        },
      });

      res.status(201).json({ newSettlement });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: "refer console for error" });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});