const validFields = ["tweet", "lang", "user"];
const validOperators = ["equals", "contains", "regex"];

/**
 * Validate a query condition based
 * @param {object} c Condition to validate
 * @returns {boolean} True if condition is valid
 */
function validCondition(c) {

    if (c.field === undefined || !validFields.includes(c.field)) return 'field must be defined as ' + validFields.join();
    if (c.operator === undefined || !validOperators.includes(c.operator)) return 'operator must be defined as ' + validOperators.join();
    if (c.value === undefined) return 'value not defined';
    if (c.operator == "regex"){
        let reStr = c.value.replace(/(^\/)|(\/$)/g, "")
        try{
            new RegExp(reStr)
        } catch (e) {
            return 'Invalid Regular Expression ' + reStr;
        }
    }

    return;
}

/**
 * Confirm that all conditions in the array are valid
 * @param {Array} queryConditions An array of query conditions to validate
 * @returns {Array} Array of errors; empty array = valid
 */
function validQueryConditions(conditions) {
    return conditions.reduce((arr, c) => {
        let error = validCondition(c);
        return error === undefined ? arr : [...arr, error];
    }, [])
}

export default validQueryConditions;