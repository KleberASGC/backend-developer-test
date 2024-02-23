const database = require('../../infra/database');

const NOT_FOUND = 0;

const getCompanyById = async (companyId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { rows } = await database.query({
      text: 'SELECT * from companies WHERE id = $1;',
      values: [companyId]
    });
    return rows[0];
  } catch (error) {
    return NOT_FOUND;
  }
  
};

const getAllCompanies = async () => {
  const { rows } = database.query('SELECT * from companies;');
  return rows;
};

module.exports = {
  getCompanyById,
  getAllCompanies
};