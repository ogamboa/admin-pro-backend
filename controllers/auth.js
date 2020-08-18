const { response } = require ('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const {email, password} = req.body;

  try{

    const usuarioDB = await Usuario.findOne ({email});

    //Verificar email
    if (!usuarioDB){
        return res.status(404).json({
            ok: false,
            msg: 'Combinación correo/contraseña no válida'
        })
    }

    //Verificar contraseña
    const validPassword  = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword){
        return res.status(400).json({
            ok:false,
            msg: 'Contraseña no válida'
        })
    }
    //Generar token
    const token = await generarJWT(usuarioDB.id);

   res.json({
       ok: true,
       token 
   })

  }
  catch (error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'No se puede realizar la operación'
        });
    }
}

module.exports = {
    login
}