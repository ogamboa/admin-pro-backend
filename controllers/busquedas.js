const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const { generarJWT } = require('../helpers/jwt');


const getTodo = async(req, res) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );

    const [usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.findOne({ nombre: regex }),
        Medico.findOne({ nombre: regex }),
        Hospital.findOne({ nombre: regex })
    ]);

    res.json({
        ok:true,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentosColeccion = async(req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.findOne({ nombre: regex })
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');
        break;

        case 'hospitales':
            data = await Hospital.findOne({ nombre: regex })
                                .populate('usuario','nombre img');
        break;

        case 'usuarios':
            data = await Usuario.findOne({ nombre: regex });
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'medicos/hospitales/usuarios'
            })
            break;

    }

    res.json({
        ok:true,
        resultados: data
    })

}


module.exports = {
    getTodo, getDocumentosColeccion
}