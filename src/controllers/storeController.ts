import StoreService from "../services/storeService";

export default class StoreController {
    storeService: StoreService;

    constructor() {
        this.storeService = new StoreService();
    }
}
