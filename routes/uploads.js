/*
api/uploads
*/

const { Router } = require ('express');
const { fileUpload, retornaImagen } = require ('../controllers/uploads')
const { validarJWT } = require('../middlewares/validar-jwt');

const expresssFileUpload = require('express-fileupload');


const router = Router();
router.use(expresssFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornaImagen);



module.exports = router;