
const { z } = require('zod');
const mongoose = require('mongoose');

const employeeSchema = z.strictObject({
  first_name: z.string().trim().min(2).max(50),
  last_name: z.string().trim().min(2).max(50),
  email: z.email().trim().toLowerCase(),
  position: z.string().trim().min(2).max(100),
  salary: z.number().positive().finite(),
  date_of_joining: z.iso.date(),
  department: z.string().trim().min(2).max(100)
});

function validateEmployee(req, res, next) {
  const result = employeeSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Employee validation failed',
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'request',
        message: issue.message
      }))
    });
  }

  req.validatedEmployee = result.data;
  next();
}

function validateEmployeeId(req, res, next) {
  const employeeId = req.params.eid || req.query.eid;

  if (
    typeof employeeId !== 'string' ||
    !mongoose.isObjectIdOrHexString(employeeId)
  ) {
    return res.status(400).json({
      success: false,
      message: 'A valid employee ID is required'
    });
  }

  req.employeeId = employeeId;
  next();
}

module.exports = {
  validateEmployee,
  validateEmployeeId
};
