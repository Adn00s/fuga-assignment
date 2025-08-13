import DevService from '../../services/dev.service.js';
import { HttpError } from '../../../common/errors.js';

class DevController {
  async reset(req, res, next) {
    try {
      const result = await DevService.resetDatabase();
      res.status(200).json(result);
    } catch (error) {
      next(new HttpError(500, error.message));
    }
  }
}

export default new DevController();
