const yup = require('yup');


const createRepairTypeDTO = yup.object().shape({
    name: yup.string().required(),
    durationInDays: yup.number().min(1, "Duration must be at least 1 day").required(),
    cost: yup.number().min(1, "Cost must be at least 1 dollar").required(),
    notes: yup.string()
});

const updateRepairTypeDTO = yup.object().shape({
    name: yup.string(),
    durationInDays: yup.number().min(1),
    cost: yup.number().min(1),
    notes: yup.string()
});


module.exports = {
    createRepairTypeDTO,
    updateRepairTypeDTO
};
