export let JWT_SECRET: string | undefined = "";
export let SCALLOPS_ROOT_TOKEN: string | undefined = "";

export function loadConstants() {
    JWT_SECRET = process.env.CLERK_PEM_PUBLIC_KEY;
    if (!JWT_SECRET) {
        throw Error("JWT_SECRET NOT DEFINED");
    }

    SCALLOPS_ROOT_TOKEN = process.env.SCALLOPS_ROOT_TOKEN;
    if (!SCALLOPS_ROOT_TOKEN) {
        throw Error("SCALLOPS_ROOT_TOKEN NOT DEFINED");
    }
}
