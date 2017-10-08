const validFields = ["tweet", "language", "user"];
const validOperators = ["equals", "contains", "regex"];

/**
 * Validate a query condition based
 * @param {object} c Condition to validate
 * @returns {boolean} True if condition is valid
 */
function validCondition(c) {

    if (c.field === undefined || !validFields.includes(c.field)) return false;
    if (c.operator === undefined || !validOperators.includes(c.operator)) return false;
    if (c.value === undefined) return false;

    return true;
}

/**
 * Confirm that all conditions in the array are valid
 * @param {Array} queryConditions An array of query conditions to validate
 * @returns {boolean} True if all conditions are valid
 */
function validQueryConditions(conditions) {
    return conditions.every((c) => {
        return validCondition(c)
    })
}

export default validQueryConditions;