// src/middleware/ownershipMiddleware.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkOwnership = async (req, res, next) => {
    const { id } = req.params; // The ID of the dog picture
    const userId = req.user.id; // Assuming user ID is available in req.user
    console.log(userId)
    try {
        const dogPic = await prisma.dog.findUnique({
            where: { id: id },
        });

        if (!dogPic) {
            // return res.status(404).json({ error: 'Dog picture not found.' });
            return res.status(404).render('error', { message: 'Dog picture not found' })
        }

        // Check if the logged-in user is the owner
        if (dogPic.userId !== userId) {
            // return res.status(403).json({ error: 'You are not authorized to perform this action as this image was not uploaded by you.' });
            return res.status(403).render('error', { message: 'You are not authorized to perform this action as this image was not uploaded by you.' })
        }

        // If the user is the owner, proceed to the next middleware/handler
        next();
    } catch (error) {
        console.error("Error checking ownership:", error);
        return res.status(500).json({ error: 'An error occurred while checking ownership.' });
    }
};

module.exports = checkOwnership;
