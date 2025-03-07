import jwt from "jsonwebtoken";
import prisma from "../../prisma";

export const LoginService = async (req: {
  email: string;
  password: string;
}) => {
  try {
    const result = await prisma.users.findUnique({
      where: {
        email: req.email,
        password: req.password,
      },
    });

    if (!result) {
      throw new Error("User Not Found");
    }

    let accessToken = jwt.sign(
      {
        id: result.id,
        email: result.email,
        roleId: result.roleId,
      },
      "rubnawaz"
    );

    return Promise.resolve(accessToken);
  } catch (err) {
    return Promise.reject(new Error((err as Error)?.message));
  }
};
