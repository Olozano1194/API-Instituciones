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
        //console.log('Datos recibidos:', req.body);
        
        //validación
        const { nombre, apellido, email, password, rol } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }
        //Verificamos si el usuario ya existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ message: "El usuario ya existe", details: 'El email ya está registrado' });
        };
        //Encriptar manualmente la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        //Crea el nuevo usuario con la contraseña ya encriptada
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email,
            password: hashedPass,
            rol: rol || 'estudiante',
            idinstitucion: req.body.idinstitucion || null
        });

        // console.log('Intentando guardar usuario:', {
        //     nombre,
        //     apellido,
        //     email,
        //     rol: nuevoUsuario.rol,
        //     idinstitucion: nuevoUsuario.idinstitucion
        // });
        
        const usuarioGuardado = await nuevoUsuario.save();

        //Generar token
        const token = jwt.sign({ id: usuarioGuardado._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        //Enviamos la respuesta sin el password
        // const usuarioResponse = usuarioGuardado.toObject();
        // delete usuarioResponse.password;

        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: usuarioGuardado,
            token
        });
    } catch (error) {
        // console.error('Error al crear usuario:', error);        
        if (error.code === 11000) {
            return res.status(400).json({
                message: "El email ya está registrado",
                details: error.message
            });
        }
        res.status(500).json({
            message: "Error al crear el usuario",
            details: error.message
        });   
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
            return res.status(404).json({ message: 'Credenciales inválidas' });
        }
        
        //Verificamos si la contraseña es correcta
        const isValidPassword = bcrypt.compare(password,  usuario.password);        
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        //Generamos un token de acceso
        const token = jwt.sign({ 
            id: usuario._id }, 
            process.env.SECRET_KEY, { expiresIn: '24h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });

    }catch (err) {
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: err.message 
        });
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