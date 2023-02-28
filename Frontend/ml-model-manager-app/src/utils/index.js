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

export const FormatTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const formattedDate = `${date}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
}

