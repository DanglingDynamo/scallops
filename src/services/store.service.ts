import prisma from "../../prisma";

export const addStore = async (name: string, clerkID: string | undefined) => {
    try {
        if (!clerkID) {
            throw Error("user id not found");
        }
        const store = await prisma.store.create({
            data: {
                owner: {
                    connect: {
                        clerkId: clerkID,
                    },
                },
                name: name,
            },
        });
        return store.id;
    } catch (error) {
        throw error;
    }
};

export const removeStore = async (id: string | undefined) => {
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

export const findStore = async (userID: string | undefined) => {
    if (!userID) {
        throw Error("user id not found");
    }

    try {
        const store = await prisma.store.findFirst({
            where: {
                owner: {
                    clerkId: userID,
                },
            },
        });

        return store;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
