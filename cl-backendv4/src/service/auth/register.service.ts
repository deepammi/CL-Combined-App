import prisma from "../../prisma";



export const RegisterService = async (req: { email: string, password: string }) => {
    try {
        const result: any = await prisma.users.create({
            data: {
                email: req.email,
                password: req.password,
                roleId: 2 // viewer role by default
            },
        });
        return Promise.resolve({ response: 'User Register Success', result: result });
    } catch (err) {
        return Promise.reject({ error: "This email was already registered." });
    }

}