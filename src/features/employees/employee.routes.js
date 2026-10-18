
const express = require('express');
const requireAuth = require('../../middleware/requireAuth');

const {
  listEmployees,
  addEmployee,
  findEmployee,
  editEmployee,
  removeEmployee
} = require('./employee.controller');

const {
  validateEmployee,
  validateEmployeeId
} = require('./employee.validation');

const router = express.Router();

router.use(requireAuth);

router.get('/employees', listEmployees);

router.post(
  '/employees',
  validateEmployee,
  addEmployee
);

router.get(
  '/employees/:eid',
  validateEmployeeId,
  findEmployee
);

router.put(
  '/employees/:eid',
  validateEmployeeId,
  validateEmployee,
  editEmployee
);

router.delete(
  '/employees',
  validateEmployeeId,
  removeEmployee
);

module.exports = router;
