const validate = (schema, type) => async (req, res, next) => {
    const payload = req[type];
    try {
        await schema.validate(payload);
        next();
    } catch (err) {
        if (err.name !== 'ValidationError') throw err;
        res.status(400).json({ name: err.name, errors: err.errors, message: err.message });
    }
}

module.exports = validate;
