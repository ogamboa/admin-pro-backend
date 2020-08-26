const { response } = require ('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res =response ) => {

    const googleToken = req.body.token;
    try{

        const {name,email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if (!usuarioDB){
            //si no existe el usuario
            usuario = new Usuario({
                nombre:name,
                email,
                password: '123',
                img: picture,
                google: true
            })
        }
        else{
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en DB
        await usuario.save();

        //Generar token
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            token
        })
    }
    catch (error){
        res.json({
            ok:false,
            msg: 'Token no es correcto'
        })
    }
   
}

const renewToken = async (req, res = response ) =>{

    const uid = req.uid;

    //Generar token
    const token = await generarJWT(uid);

    res.json({
        ok:true,
        token

    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}