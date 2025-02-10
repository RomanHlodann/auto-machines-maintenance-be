const yup = require('yup');


const createRepairDTO = yup.object().shape({
    machine: yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid machine ID").required(),
    repairType: yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid machine ID").required(),
    beginDate: yup.date().required(),
    notes: yup.string()
});

const updateRepairDTO = yup.object().shape({
    machine: yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid machine ID"),
    repairType: yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid machine ID"),
    beginDate: yup.date(),
    notes: yup.string()
});


module.exports = {
    createRepairDTO,
    updateRepairDTO
};
