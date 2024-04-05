import {PostService} from "@services/post.service";
import {StatusId} from "@constants/status";

const checkIsPending = async () => {
    try {
        let date = new Date();
        let pendingPostServiceResult = await PostService.getMany({
            statusId: StatusId.Pending,
            dateStart: date
        })

        if(pendingPostServiceResult.length > 0){
            await PostService.updateStatusMany({
                _id: pendingPostServiceResult.map(pendingPost => pendingPost._id.toString()),
                statusId: StatusId.Active
            })
        }
    }catch (e) {}
}

export const PostTimer = {
    checkIsPending: checkIsPending
}