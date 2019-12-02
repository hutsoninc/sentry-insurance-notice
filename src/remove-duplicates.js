const trimLower = val => {
    return String(val)
        .toLowerCase()
        .trim();
};

const removeDuplicates = arr => {
    const keys = [];

    const filteredArray = arr.reduce((acc, obj) => {
        const key = [obj.street, obj.city, obj.state, obj.zip]
            .map(trimLower)
            .join(' ');

        if (keys.indexOf(key) === -1) {
            keys.push(key);
            acc.push(obj);
        }

        return acc;
    }, []);

    return filteredArray;
};

module.exports = removeDuplicates;
