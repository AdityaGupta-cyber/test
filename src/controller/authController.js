const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/tokenUtils');
const multer = require('multer');
const path = require('path');
const prisma = new PrismaClient();
const fs = require('fs');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '../../', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const uploaded = multer({ storage });

const renderLogin = (req, res) => res.render('login');
const renderSignup = (req, res) => res.render('signup');

const list = async (req, res) => {
    try {
        const dogPics = await prisma.dog.findMany({ include: { user: true } });
        res.render('list', { dogPics });
    } catch (error) {
        console.error("Error fetching dog pictures:", error);
        res.status(500).json({ error: 'Error retrieving dog pictures.' });
    }
};

const singleList = async (req, res) => {
    try {
        const { id } = req.params;
        const dogPic = await prisma.dog.findUnique({ where: { id }, include: { user: true } });
        res.render('singleList', { dogPic });
    } catch (error) {
        console.error("Error fetching dog picture:", error);
        res.status(500).render('error', { message: 'Error retrieving dog picture.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

    try {
        const user = await prisma.user.findFirst({ where: { username: username.toLowerCase() } });
        if (!user) return res.status(401).json({ error: 'User not found.' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: 'Incorrect password.' });

        const token = generateToken(user);
        res.cookie('jwt', token, { httpOnly: true });
        res.redirect('/list');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login error.' });
    }
};

const signUp = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

    try {
        const existingUser = await prisma.user.findFirst({ where: { username: username.toLowerCase() } });
        if (existingUser) return res.status(409).json({ error: 'Username exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { username: username.toLowerCase(), password: hashedPassword } });

        const token = generateToken(user);
        res.cookie('jwt', token, { httpOnly: true });
        res.status(201).redirect('/list');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Signup error.' });
    }
};

const renderUploadPic = (req, res) => res.render('upload');

const upload = async (req, res) => {
    const { description } = req.body;
    const user = req.user;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const originalPath = path.join(__dirname, '../../uploads', req.file.filename);
    const tempPath = path.join(__dirname, '../../uploads', `temp_${req.file.filename}`);
    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        await sharp(originalPath).resize(400).jpeg({ quality: 80 }).toFile(tempPath);
        fs.renameSync(tempPath, originalPath);

        await prisma.dog.create({ data: { imageUrl, description, userId: user.id } });
        res.redirect('/list');
    } catch (error) {
        console.error("Image upload error:", error);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ error: 'Upload error.' });
    }
};

const renderEditPic = async (req, res) => {
    const { id } = req.params;
    const dogPic = await prisma.dog.findUnique({ where: { id } });
    res.render('edit', { dogPic });
};

const updatePic = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    const dogPic = await prisma.dog.findUnique({ where: { id } });
    if (!dogPic) return res.status(404).json({ error: 'Picture not found.' });

    const originalPath = path.join(__dirname, '../../uploads', dogPic.imageUrl.split('/').pop());
    const tempPath = path.join(__dirname, '../../uploads', `temp_${dogPic.imageUrl.split('/').pop()}`);

    try {
        if (req.file) {
            await sharp(req.file.path).resize(800).jpeg({ quality: 80 }).toFile(tempPath);
            fs.renameSync(tempPath, originalPath);
        }

        await prisma.dog.update({
            where: { id },
            data: { description, ...(req.file && { imageUrl: `/uploads/${req.file.filename}` }) },
        });

        res.redirect('/list');
    } catch (error) {
        console.error("Update error:", error);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ error: 'Update error.' });
    }
};

const renderDeletePic = async (req, res) => {
    const { id } = req.params;
    try {
        const dogPic = await prisma.dog.findUnique({ where: { id } });
        if (!dogPic) return res.status(404).json({ error: 'Picture not found.' });
        res.render('delete', { dogPic });
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: 'Fetch error.' });
    }
};

const deletePic = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.dog.delete({ where: { id } });
        res.redirect('/list');
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: 'Delete error.' });
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
};

module.exports = {
    login,
    signUp,
    logout,
    renderLogin,
    renderSignup,
    list,
    renderUploadPic,
    upload,
    uploaded,
    renderEditPic,
    updatePic,
    deletePic,
    renderDeletePic,
    singleList,
};
