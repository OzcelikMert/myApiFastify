import { PostService } from '@services/post.service';
import { StatusId } from '@constants/status';

const checkIsPending = async () => {
  try {
    const date = new Date();
    const serviceResult = await PostService.getMany({
      statusId: StatusId.Pending,
      dateStart: date,
    });

    if (serviceResult.length > 0) {
      await PostService.updateStatusMany({
        _id: serviceResult.map((item) => item._id.toString()),
        statusId: StatusId.Active,
      });
    }
  } catch (e) {}
};

export const PostTimer = {
  checkIsPending: checkIsPending,
};
