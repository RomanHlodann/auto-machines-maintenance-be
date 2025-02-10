function isObjectRelatedToUser(schema) {
  return async (req, res, next) => {
    try {
        const object = await schema.findById(req.params.id);
        if (!object || !object.user || object.user.toString() !== req.user._id) {
            return res.status(404).send({'message': 'Object was not found'});
        }

        req.neededObject = object;

        next();
    } catch (err) {
        next(err);
    }
  };
}

module.exports = isObjectRelatedToUser;
