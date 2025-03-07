import { Request, Response } from 'express';
import prisma from '../prisma';

export const emailDraftUpdateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { buyerIdentifier, emailScripts } = req.body;

        if (!buyerIdentifier || !emailScripts) {
            res.status(400).send({ error: 'Missing buyerId or emailScripts in request body' });
            return;
        }

        const updatedBuyer = await prisma.emailScript.update({
            select: {
                email1: true,
                email2: true,
                email3: true,
                linkedIn1: true,
                linkedIn2: true,
            },
            where: { buyer_identifier:  buyerIdentifier},
            data: emailScripts,
        });

        if (updatedBuyer === null) {
            res.status(404).send({ error: 'Buyer not found or no email scripts updated' });
            return;
        }

        res.json({ message: 'Buyer email scripts updated successfully', data: updatedBuyer });
    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
};