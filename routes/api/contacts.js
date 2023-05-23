const express = require('express')

const contactsController = require('../../controllers/contacts-controllers')

const {validateBody} =require('../../decorators');
const {isValidId} =require('../../middlewares/isValidId')
const {schemas} =require('../../models/contact');

const router = express.Router();

router.get('/', contactsController.getContactsController )

router.get('/:id', isValidId, contactsController.getContactDataByIdController)

router.post('/', validateBody(schemas.schema), contactsController.addNewContactController)

router.delete('/:id', isValidId, validateBody(schemas.schema), contactsController.deleteContactByIdController)

router.put('/:id',isValidId,  contactsController.updateContactByIdController)
router.patch('/:id/favorite', isValidId, validateBody(schemas.updateFavoriteSchema), contactsController.updateFavorite)

module.exports = router
