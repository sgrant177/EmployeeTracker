const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { findAllRoles, createRole, removeRole } = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_ROLE"
        },
        //You will need to complete the rest of the switch statement
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
      return deleteRole();
    case "UPDATE_ROLE":
      return changeRole();
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENT":
      return deleteDepartment();
    //You will need to complete the rest of the cases 
    default:
      return quit();
  }
}

async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see direct reports for?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("The selected employee has no direct reports");
  } else {
    console.table(employees);
  }

  loadMainPrompts();
}

async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    },
    {
      name: "role_id",
      message: "What is the employee's role id?"
    }
  ]);
  await db.createEmployee(employee);

  console.log("Added employee to the database");

  loadMainPrompts();

}

async function viewRoles() {
  const roles = await db.findAllRoles();
  console.table(roles);
  loadMainPrompts();
}

async function viewDepartments() {
  const departments = await db.findAllDepartments();
  console.table(departments);
  loadMainPrompts();
}

async function addRole() {
  const roles = await db.findAllRoles();
  const departments = await db.findAllDepartments();

  const role = await prompt([
    {
      name: "title",
      message: "What is the title of the role?"
    },
    {
      name: "salary",
      message: "What is the salary for the role?"
    },
    {
      name: "department_id",
      message: "What is the department id for the role?"
    }
  ]);
  await db.createRole(role)
  console.log("Added role to the database");
  loadMainPrompts();
}

async function deleteRole() {
  const roles = await db.findAllRoles();

  const rolesChoice = roles.map(({ id, title, salary }) => ({
    name: `${title} ${salary}`,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to remove?",
      choices: rolesChoice
    }
  ]);

  await db.removeRole(roleId);

  console.log("Removed role from the database");

  loadMainPrompts();
}

async function changeRole() {
  const employees = await db.findAllEmployees();
  const roles = await db.findAllRoles();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const roleChoices = roles.map(({ id, title, salary }) => ({
    name: `${title} ${salary}`,
    value: id
  }));

  const { employee } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role would you like to update?",
      choices: employeeChoices
    },
  ]);

  const { role } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role would you like to choose?",
      choices: roleChoices
    },
  ]);

  await db.updateEmployeeRole(employee, role);

  console.log("Updated employee role in the database");

  loadMainPrompts();
}

async function addDepartment() {
  const departments = await db.findAllDepartments();

  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ]);
  await db.createDepartment(department)
  console.log("Added department to the database");
  loadMainPrompts();
}

async function deleteDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoice = departments.map(({ id, name }) => ({
    name: `${name}`,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department do you want to remove?",
      choices: departmentChoice
    }
  ]);

  await db.removeDepartment(departmentId);

  console.log("Removed role from the database");

  loadMainPrompts();
}



function quit() {
  console.log("Goodbye!");
  process.exit();
}