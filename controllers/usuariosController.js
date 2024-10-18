const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todas los Usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nuevo Usuario
const createUsuario = async (req, res) => {
    //const nuevoUsuario = new Usuario(req.body);
    try {
        //Encriptar manualmente la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        //Crea el nuevo usuario con la contraseña ya encriptada
        const nuevoUsuario = new Usuario({
            ...req.body,
            password: hashedPass
        });
        
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener un Usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Usuario
const updateUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un Usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
    //console.log('Datos recibidos en el login:', req.body);
    
    const { email, password } = req.body;
    
    try {
        //Verficamos si el usuario existe
        const usuario = await Usuario.findOne({ email });
        if  (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        //Verificamos si la contraseña es correcta
        const isValidPassword = bcrypt.compare(password,  usuario.password);
        
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta'});
        }
        //Generamos un token de acceso
        const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });

    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    loginUsuario,    
};