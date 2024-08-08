const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    created_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
}, { collection: 'Users' });  // Especifica el nombre de la colección aquí

// Método estático para crear un usuario
userSchema.statics.createUser = async function({ first_name, last_name, email, password }) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });
        await user.save();
        return { error: false, msg: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user:', error);
        return { error: true, msg: error.message };
    }
};

// Crear el modelo de usuario
const User = mongoose.model('User', userSchema);

module.exports = { User };
