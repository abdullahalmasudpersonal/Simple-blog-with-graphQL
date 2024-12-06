import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface userInfo {
  name: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: async (parant: any, args: userInfo, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parant: any, args: userInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: { name: args.name, email: args.email, password: hashedPassword },
      });
      const token = jwt.sign({ userId: newUser.id }, "signature", {
        expiresIn: "1d",
      });
      return {
        userError: null,
        token,
      };
    },
    signin: async (parent: any, args: any, content: any) => {
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      if (!user) {
        return {
          userError: "User Not Found !",
          token: null,
        };
      }
      const currectPassword = await bcrypt.compare(
        args.password,
        user?.password
      );
      if (!currectPassword) {
        return {
          userError: "Incorrect password!",
          token: null,
        };
      }
      const token = jwt.sign({ userId: user.id }, "signature", {
        expiresIn: "1d",
      });
      return {
        userError: null,
        token,
      };
    },
  },
};
