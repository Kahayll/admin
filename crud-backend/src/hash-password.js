
import bcrypt from 'bcryptjs';

const defaultPassword = 'admin'; 
const saltRounds = 10; 

bcrypt.hash(defaultPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("Hashed password for 'admin':", hash);
});