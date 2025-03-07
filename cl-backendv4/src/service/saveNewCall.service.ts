import prisma from "../prisma";


export const saveNewCallService = async (contactInformation: { contactId: string, buyer_id: string }) => {
    try {
        const checkIfExist: any = await prisma.call_logs.findMany({
            where: {
                call_id: contactInformation?.contactId,
            },
        });
        if (!checkIfExist.length) {
            const entryId = await prisma.call_logs.create({
                data: {
                    call_id: contactInformation.contactId,
                    buyer_id: contactInformation.buyer_id,
                },
            });
            return Promise.resolve({ response: "Created entry", id: entryId });
        } else
            return Promise.reject({ response: "callId already exists", id: checkIfExist });
    } catch (err) {
        console.log("[ERROR]:", err);
        return;
    }
}