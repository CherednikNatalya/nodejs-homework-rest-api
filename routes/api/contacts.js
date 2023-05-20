const express = require('express')

const contactsController = require('../../controllers/contacts-controllers')

const {validateBody} =require('../../decorators');
const {schema} =require('../../models/contact')

const router = express.Router();

router.get('/', contactsController.getContactsController )

router.get('/:id', contactsController.getContactDataByIdController)

router.post('/', validateBody(schema), contactsController.addNewContactController)

router.delete('/:id', validateBody(schema), contactsController.deleteContactByIdController)

router.put('/:id', contactsController.updateContactByIdController)

module.exports = router
