const { check } = require('express-validator'); 
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40})
    .withMessage('Must be between 5 and 40 charachters!'),
    requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1})
    .withMessage('Must be number greater then 1!'),
    requireEmail: check('email')
    .trim().normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email!')
    .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email });
        if(existingUser){
            throw new Error('Email is use!');
        }
    }),
    requirePassword: check('pass')
    .trim()
    .isLength({ min:4, max:20 })
    .withMessage('Must be between 4 and 20 characters!'),
    requirePasswordConf: check('passconf')
    .trim()
    .isLength({ min:4, max:20 })
    .withMessage('must be between 4 and 20 character!')
    .custom((passconf, { req }) => {
        if(passconf !== req.body.pass){
            throw new Error('Passwords must match!!');
        }
    }),
    requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valide email!')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({email});
        if(!user){
            throw new Error('Email not found!');
        }
    }),
    requireValidPassword: check('pass')
    .trim()
    .custom(async (pass, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email});
        if(!user){
            throw new Error('Invalid password!');
        }
        const validPassword = await usersRepo.comparePassword(user.pass, pass);
        if(!validPassword){
            throw new Error('Invalid password!');
        }
    })
}