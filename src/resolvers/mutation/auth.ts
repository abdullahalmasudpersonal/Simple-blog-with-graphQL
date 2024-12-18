import config from "../../config";
import { jwtHelper } from "../../utils/jwtHelper";
import bcrypt from "bcrypt";

interface userInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const authResolvers = {
  signup: async (parant: any, args: userInfo, { prisma }: any) => {
    const isExist = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });
    if (isExist) {
      return {
        userError: "Already this email is registered!",
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const newUser = await prisma.user.create({
      data: { name: args.name, email: args.email, password: hashedPassword },
    });

    if (args.bio) {
      await prisma.profile.create({
        data: {
          bio: args.bio,
          userId: newUser.id,
        },
      });
    }

    const token = await jwtHelper.generateToken(
      { userId: newUser.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },
  signin: async (parent: any, args: any, { prisma }: any) => {
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
    const currectPassword = await bcrypt.compare(args.password, user?.password);
    if (!currectPassword) {
      return {
        userError: "Incorrect password!",
        token: null,
      };
    }

    const token = await jwtHelper.generateToken(
      { userId: user.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },
};
