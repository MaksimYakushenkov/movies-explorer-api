const router = require('express').Router();
const { NotFoundError } = require('../utils/errors/not-found-err');
const { invalidUrl } = require('../utils/errors/constantsError');
router.use(require('./auth'));

router.use(require('../middlewares/auth'));
router.use(require('./signout'));
router.use(require('./users'));
router.use(require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError(invalidUrl)));

module.exports = router;
