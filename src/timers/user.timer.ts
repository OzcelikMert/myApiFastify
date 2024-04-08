import {StatusId} from "@constants/status";
import {UserService} from "@services/user.service";

const checkBanDateEnd = async () => {
    try {
        let date = new Date();
        let serviceResult = await UserService.getMany({
            statusId: StatusId.Banned,
            banDateEnd: date
        })

        if(serviceResult.length > 0){
            await UserService.updateStatusMany({
                _id: serviceResult.map(item => item._id.toString()),
                statusId: StatusId.Active
            })
        }
    }catch (e) {}
}

export const UserTimer = {
    checkBanDateEnd: checkBanDateEnd
}