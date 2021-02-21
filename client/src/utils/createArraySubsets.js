const createArraySubsets = (array, subsetLength) => {
    if (!Array.isArray(array)) array = [array];
    if (Object.is(NaN, Number(subsetLength))) throw new Error('Subset Length should be a number!');

    return array.reduce((result, value, index) => {
        if (index % subsetLength === 0) result.push(array.slice(index, index + subsetLength));
        return result;
    }, []);
}

export default createArraySubsets;