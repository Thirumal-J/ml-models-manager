export const OptionsCreator = (array) => {
    const tempArr = [];
    array.map((obj) =>
        tempArr.push({ "value": obj, "label": obj })
    );
    return tempArr;
};

export const ExperimentNames = (experimentsList) => {
    const tempArr = [];
    experimentsList.map((experiment) =>
        tempArr.push({ "value": experiment._experiment_id, "label": experiment._name })
    );
    return tempArr;

}