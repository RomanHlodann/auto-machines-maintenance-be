const yup = require('yup');


const registerUserDTO = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
});

const loginUserDTO = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});


module.exports = {
    registerUserDTO,
    loginUserDTO
};
