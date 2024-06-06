export const truncate = (str, length) => {
    if (typeof str !== 'string') {
        return '';
    }
    return str.length > length ? str.substring(0, length) + '...' : str;
};