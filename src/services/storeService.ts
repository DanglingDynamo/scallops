import prisma from "../../prisma";

export default class StoreService {
    addStore = async (name: string, clerkID: string) => {
        try {
            await prisma.store.create({
                data: {
                    owner: {
                        connect: {
                            clerkId: clerkID,
                        },
                    },
                    name: name,
                },
            });
        } catch (error) {
            throw error;
        }
    };

    removeStore = async (id: string) => {
        try {
            await prisma.store.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw error;
        }
    };
}
