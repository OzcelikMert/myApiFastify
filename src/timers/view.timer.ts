import {ViewService} from "@services/view.service";

const checkOld = async () => {
    try {
        let dateEnd = new Date();
        dateEnd.addDays(-7);

        let serviceResult = await ViewService.get({dateEnd: dateEnd});

        if (serviceResult) {
            await ViewService.deleteMany({dateEnd: dateEnd});
        }
    }catch (e) {}
}

export const ViewTimer = {
    checkOld: checkOld
}