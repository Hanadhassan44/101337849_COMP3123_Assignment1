
const Employee = require('./employee.model');

async function listEmployees(req, res, next) {
  try {
    const employees = await Employee.find({
      user: req.user._id
    }).sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      total: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
}

async function addEmployee(req, res, next) {
  try {
    const employee = await Employee.create({
      ...req.validatedEmployee,
      user: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
}

async function findEmployee(req, res, next) {
  try {
    const employee = await Employee.findOne({
      _id: req.employeeId,
      user: req.user._id
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found'
      });
    }

    return res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
}

async function editEmployee(req, res, next) {
  try {
    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.employeeId,
        user: req.user._id
      },
      {
        $set: req.validatedEmployee
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
}

async function removeEmployee(req, res, next) {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.employeeId,
      user: req.user._id
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listEmployees,
  addEmployee,
  findEmployee,
  editEmployee,
  removeEmployee
};
