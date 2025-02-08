const yup = require('yup');


const createMachineDTO = yup.object().shape({
    country: yup.string().required(),
    productionYear: yup.number().required(),
    brand: yup.string().required()
});

const updateMachineDTO = yup.object().shape({
    country: yup.string(),
    productionYear: yup.number(),
    brand: yup.string()
});


module.exports = {
    createMachineDTO,
    updateMachineDTO
};
