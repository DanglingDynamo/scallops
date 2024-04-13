export function toJSON(obj: any) {
    return JSON.stringify(
        obj,
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    );
}
