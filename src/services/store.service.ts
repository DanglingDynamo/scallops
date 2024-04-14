import prisma from "../../prisma";

export const addStore = async (name: string, userId: string | undefined) => {
    try {
        if (!userId) {
            throw Error("user id not found");
        }
        const store = await prisma.store.create({
            data: {
                owner: {
                    connect: {
                        id: userId,
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

export const findStore = async (storeID: string | undefined) => {
    if (!storeID) {
        throw Error("store id not found");
    }

    try {
        const store = await prisma.store.findFirst({
            where: {
                id: storeID,
            },
        });

        return store;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const findStoreByUser = async (userID: string | undefined) => {
    if (!userID) {
        throw Error("store id not found");
    }

    try {
        const store = await prisma.store.findFirst({
            where: {
                owner: {
                    id: userID,
                },
            },
        });

        return store;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
