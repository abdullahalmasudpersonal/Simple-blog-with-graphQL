import { userLoader } from "../dataLoaders/userLoader";

export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: any) => {
    console.log("post", parent.authorId);
    return userLoader.load(parent.authorId);
  },
};

// await prisma.user.findUnique({
//   where: {
//     id: parent.authorId,
//   },
