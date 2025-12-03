import { ViewService } from '@services/db/view.service';

const checkOld = async () => {
  try {
    const dateEnd = new Date();
    dateEnd.addDays(-7);

    const serviceResult = await ViewService.get({ dateEnd: dateEnd });

    if (serviceResult) {
      await ViewService.deleteMany({ dateEnd: dateEnd });
    }
  } catch (e) {}
};

export const ViewTimer = {
  checkOld: checkOld,
};
