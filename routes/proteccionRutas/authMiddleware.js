const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, No hay token.' });
    }
    
    //Verificamos el token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalido.' });

        }
        req.user = user;
        next();
    });
       
    
}

module.exports = protect;