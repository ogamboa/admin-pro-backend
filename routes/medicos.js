/*
'/api/medicos'
*/

const { Router } = require ('express');
const { check } = require ('express-validator')
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico} = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get('/',  getMedicos);
router.post('/', 
    [
        validarJWT,
        check('nombre','El nombre del médico es necesario').not().isEmpty(),
        check('hospital','El ID de hospital debe de ser válido').isMongoId(),
        validarCampos
    ],
      crearMedico);
router.put('/:id', [
        validarJWT,
        check('nombre','El nombre del médico es necesario').not().isEmpty(),
        check('hospital','El ID de hospital debe de ser válido').isMongoId(),
        validarCampos
    ], 
        actualizarMedico);
router.delete('/:id', validarJWT, borrarMedico);


module.exports = router;